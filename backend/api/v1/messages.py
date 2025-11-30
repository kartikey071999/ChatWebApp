"""Message endpoints for channels."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import logging

from ...database import get_db
from ...models import User, Channel, Message, ChannelMember
from ...schemas import MessageCreate, MessageOut

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/{channel_id}", response_model=MessageOut)
def send_message(channel_id: str, user_id: str, msg: MessageCreate, db: Session = Depends(get_db)):
    """Send a message to a channel."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    channel = db.query(Channel).filter(Channel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    member = db.query(ChannelMember).filter(
        ChannelMember.user_id == user_id,
        ChannelMember.channel_id == channel_id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this channel")

    message = Message(channel_id=channel_id, sender_id=user_id, content=msg.content)
    db.add(message)
    db.commit()
    db.refresh(message)
    logger.info(f"Message sent in channel {channel_id} by {user.name}")
    return message


@router.get("/{channel_id}", response_model=List[MessageOut])
def get_channel_messages(channel_id: str, db: Session = Depends(get_db)):
    """Get all messages in a channel (channel history)."""
    channel = db.query(Channel).filter(Channel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    messages = db.query(Message).filter(Message.channel_id == channel_id).order_by(Message.created_at.asc()).all()
    return messages
