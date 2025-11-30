"""Pydantic schemas for Slack-like chat app."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .enums import RoleEnum, MessageStatus


class UserRegister(BaseModel):
    name: str
    password: str
    role: Optional[RoleEnum] = RoleEnum.USER


class UserLogin(BaseModel):
    name: str
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChannelCreate(BaseModel):
    name: str


class ChannelOut(BaseModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    content: str


class MessageOut(BaseModel):
    id: str
    channel_id: str
    sender_id: str
    content: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChannelMemberOut(BaseModel):
    user_id: str
    channel_id: str
    joined_at: datetime

    class Config:
        from_attributes = True
