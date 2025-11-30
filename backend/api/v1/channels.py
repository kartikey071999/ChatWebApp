"""Channel management endpoints."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import logging

from ...database import get_db
from ...models import User, Channel, ChannelMember
from ...schemas import ChannelCreate, ChannelOut, ChannelMemberOut
from ...enums import RoleEnum

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=ChannelOut)
def create_channel(channel_data: ChannelCreate, user_id: str, db: Session = Depends(get_db)):
    """Create a new channel (admin only). Admin is automatically joined."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != RoleEnum.ADMIN.value:
        raise HTTPException(status_code=403, detail="Only admins can create channels")

    existing = db.query(Channel).filter(Channel.name == channel_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Channel already exists")

    channel = Channel(name=channel_data.name)
    db.add(channel)
    db.commit()
    db.refresh(channel)
    
    # Automatically add admin to the channel
    member = ChannelMember(user_id=user_id, channel_id=channel.id)
    db.add(member)
    db.commit()
    
    logger.info(f"Channel created: {channel.name} (admin: {user.name})")
    return channel


@router.get("/", response_model=List[ChannelOut])
def list_channels(db: Session = Depends(get_db)):
    """List all channels."""
    return db.query(Channel).all()


@router.get("/{channel_id}", response_model=ChannelOut)
def get_channel(channel_id: str, db: Session = Depends(get_db)):
    """Get channel by ID."""
    channel = db.query(Channel).filter(Channel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel


@router.post("/{channel_id}/join")
def join_channel(channel_id: str, user_id: str, db: Session = Depends(get_db)):
    """Join a channel."""
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
    if member:
        raise HTTPException(status_code=400, detail="User already in channel")

    member = ChannelMember(user_id=user_id, channel_id=channel_id)
    db.add(member)
    db.commit()
    db.refresh(member)
    logger.info(f"User {user.name} joined channel {channel.name}")
    return {"message": "Joined channel", "user_id": user_id, "channel_id": channel_id}


@router.get("/{channel_id}/members", response_model=List[ChannelMemberOut])
def get_channel_members(channel_id: str, db: Session = Depends(get_db)):
    """Get all members in a channel."""
    members = db.query(ChannelMember).filter(ChannelMember.channel_id == channel_id).all()
    return members
