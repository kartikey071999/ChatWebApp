"""Messages API."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from ...database import get_db
from ...models import Message
from ...schemas import MessageCreate, MessageOut

router = APIRouter()


@router.post("/", response_model=MessageOut)
def send_message(message: MessageCreate, db: Session = Depends(get_db)):
    """Create message."""
    db_message = Message(
        sender_id=str(message.sender_id),
        receiver_id=str(message.receiver_id),
        content=message.content,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/{user1_id}/{user2_id}", response_model=List[MessageOut])
def get_conversation(user1_id: uuid.UUID, user2_id: uuid.UUID, db: Session = Depends(get_db)):
    """List conversation between two users."""
    messages = (
        db.query(Message)
        .filter(
            ((Message.sender_id == str(user1_id)) & (Message.receiver_id == user2_id))
            | ((Message.sender_id == str(user2_id)) & (Message.receiver_id == user1_id))
        )
        .order_by(Message.sent_time.asc())
        .all()
    )
    return messages
