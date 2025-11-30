"""WebSocket handlers for real-time chat."""
from typing import Dict, Set
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from ...database import SessionLocal
from ...models import Message

logger = logging.getLogger(__name__)

router = APIRouter()


class ConnectionManager:
    """Track active WebSocket connections per user."""

    def __init__(self):
        self.active: Dict[str, Set[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        conns = self.active.setdefault(user_id, set())
        conns.add(websocket)
        logger.info("User %s connected", user_id)

    def disconnect(self, user_id: str, websocket: WebSocket):
        conns = self.active.get(user_id)
        if not conns:
            return
        conns.discard(websocket)
        if not conns:
            self.active.pop(user_id, None)
        logger.info("User %s disconnected", user_id)

    async def send_personal(self, websocket: WebSocket, message: dict):
        await websocket.send_text(json.dumps(message))

    async def send_to_user(self, user_id: str, message: dict) -> bool:
        conns = self.active.get(user_id)
        if not conns:
            return False
        payload = json.dumps(message)
        for ws in set(conns):
            try:
                await ws.send_text(payload)
            except Exception:
                logger.exception("Failed to send to user %s", user_id)
        return True


manager = ConnectionManager()


def persist_message(sender_id: str, receiver_id: str, content: str) -> dict:
    db: Session = SessionLocal()
    try:
        db_message = Message(sender_id=str(sender_id), receiver_id=str(receiver_id), content=content)
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return {
            "id": db_message.id,
            "sender_id": db_message.sender_id,
            "receiver_id": db_message.receiver_id,
            "content": db_message.content,
            "status": db_message.status,
            "is_deleted": db_message.is_deleted,
            "sent_time": db_message.sent_time.isoformat(),
        }
    finally:
        db.close()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "invalid_json"}))
                continue

            receiver_id = payload.get("receiver_id")
            content = payload.get("content")
            if not receiver_id or not content:
                await websocket.send_text(json.dumps({"error": "missing_fields"}))
                continue

            msg = persist_message(sender_id=user_id, receiver_id=receiver_id, content=content)
            delivered = await manager.send_to_user(receiver_id, {"type": "message", "message": msg})
            await manager.send_personal(websocket, {"type": "ack", "delivered": delivered, "message": msg})

    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
    except Exception:
        logger.exception("WebSocket error for user %s", user_id)
        manager.disconnect(user_id, websocket)
