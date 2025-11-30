"""WebSocket handler for real-time channel messaging and online tracking."""

import json
import logging
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from ...database import SessionLocal
from ...models import Message, ChannelMember

logger = logging.getLogger(__name__)
router = APIRouter()


class ChannelConnectionManager:
    """Manage WebSocket connections per channel.
    
    Tracks online users per channel: channel_id -> set(WebSocket)
    """

    def __init__(self):
        # channel_id -> {(user_id, WebSocket), ...}
        self.active_channels: Dict[str, Set[tuple]] = {}

    async def connect(self, channel_id: str, user_id: str, websocket: WebSocket):
        """Register a user connection to a channel."""
        await websocket.accept()
        if channel_id not in self.active_channels:
            self.active_channels[channel_id] = set()
        self.active_channels[channel_id].add((user_id, websocket))
        logger.info(f"User {user_id} connected to channel {channel_id}")

    def disconnect(self, channel_id: str, user_id: str, websocket: WebSocket):
        """Unregister a user connection."""
        if channel_id in self.active_channels:
            self.active_channels[channel_id].discard((user_id, websocket))
            if not self.active_channels[channel_id]:
                del self.active_channels[channel_id]
        logger.info(f"User {user_id} disconnected from channel {channel_id}")

    async def broadcast_to_channel(self, channel_id: str, message: dict):
        """Broadcast message to all users in a channel."""
        if channel_id not in self.active_channels:
            return
        payload = json.dumps(message)
        for user_id, ws in list(self.active_channels[channel_id]):
            try:
                await ws.send_text(payload)
            except Exception as e:
                logger.exception(f"Failed to send to user {user_id}: {e}")

    def get_online_users(self, channel_id: str) -> set:
        """Get set of online user IDs in a channel."""
        if channel_id not in self.active_channels:
            return set()
        return {user_id for user_id, ws in self.active_channels[channel_id]}


manager = ChannelConnectionManager()


@router.websocket("/channels/{channel_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, channel_id: str, user_id: str):
    """WebSocket endpoint for real-time channel messaging."""
    db: Session = SessionLocal()
    try:
        # Verify user is member of channel
        member = db.query(ChannelMember).filter(
            ChannelMember.user_id == user_id,
            ChannelMember.channel_id == channel_id
        ).first()
        if not member:
            await websocket.close(code=403, reason="Not a member of this channel")
            return

        await manager.connect(channel_id, user_id, websocket)

        # Send online users list
        online_users = manager.get_online_users(channel_id)
        await manager.broadcast_to_channel(channel_id, {
            "type": "user_joined",
            "user_id": user_id,
            "online_users": list(online_users),
        })

        while True:
            data = await websocket.receive_text()
            try:
                # Try to parse as JSON; if fails, treat as raw message content
                try:
                    payload = json.loads(data)
                    content = payload.get("content", "").strip()
                except json.JSONDecodeError:
                    # Treat raw text as message content
                    content = data.strip()
                
                if not content:
                    await websocket.send_text(json.dumps({"error": "Empty message"}))
                    continue

                # Persist message
                msg = Message(channel_id=channel_id, sender_id=user_id, content=content)
                db.add(msg)
                db.commit()
                db.refresh(msg)

                # Broadcast to all users in channel
                await manager.broadcast_to_channel(channel_id, {
                    "type": "message",
                    "id": msg.id,
                    "sender_id": user_id,
                    "content": content,
                    "created_at": msg.created_at.isoformat(),
                })

            except Exception as e:
                logger.exception(f"Error processing message: {e}")

    except WebSocketDisconnect:
        manager.disconnect(channel_id, user_id, websocket)
        online_users = manager.get_online_users(channel_id)
        await manager.broadcast_to_channel(channel_id, {
            "type": "user_left",
            "user_id": user_id,
            "online_users": list(online_users),
        })
    except Exception as e:
        logger.exception(f"WebSocket error: {e}")
        manager.disconnect(channel_id, user_id, websocket)
    finally:
        db.close()
