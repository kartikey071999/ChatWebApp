from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from datetime import datetime
from .enums import GenderEnum, MessageStatus
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    gender: GenderEnum = GenderEnum.NOT_SPECIFIED
    contact: str


class UserOut(UserCreate):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str
class MessageCreate(BaseModel):
    sender_id: UUID
    receiver_id: UUID
    content: str


class MessageOut(BaseModel):
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    content: str
    status: MessageStatus
    is_deleted: bool = False
    sent_time: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
