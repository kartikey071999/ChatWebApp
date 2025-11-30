from datetime import datetime, UTC
from sqlalchemy import (
    Column, String, DateTime, Enum, ForeignKey, Table
)
from sqlalchemy.orm import relationship, declarative_base
import uuid

from .enums import RoleEnum, MessageStatus

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default=RoleEnum.USER.value, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    messages = relationship("Message", back_populates="sender")
    channel_members = relationship("ChannelMember", back_populates="user")


class Channel(Base):
    __tablename__ = "channels"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)

    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    messages = relationship("Message", back_populates="channel", cascade="all, delete-orphan")
    members = relationship("ChannelMember", back_populates="channel", cascade="all, delete-orphan")


class ChannelMember(Base):
    __tablename__ = "channel_members"

    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True)
    channel_id = Column(String(36), ForeignKey("channels.id"), primary_key=True)
    joined_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)

    user = relationship("User", back_populates="channel_members")
    channel = relationship("Channel", back_populates="members")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    channel_id = Column(String(36), ForeignKey("channels.id"), nullable=False, index=True)
    sender_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    content = Column(String, nullable=False)
    status = Column(String(20), default=MessageStatus.SENT.value, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    channel = relationship("Channel", back_populates="messages")
    sender = relationship("User", back_populates="messages")
