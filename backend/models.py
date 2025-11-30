from datetime import datetime, UTC
from sqlalchemy import (
    Column, String, DateTime, Enum, ForeignKey, Boolean, Table
)
from sqlalchemy.orm import relationship, declarative_base
import uuid

from .enums import GenderEnum, MessageStatus

Base = declarative_base()


user_connections = Table(
    "user_connections",
    Base.metadata,
    Column("user_id", String(36), ForeignKey("users.id"), primary_key=True),
    Column("connection_id", String(36), ForeignKey("users.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True, index=True)

    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)

    first_name = Column(String(50), nullable=False)
    middle_name = Column(String(50))
    last_name = Column(String(50), nullable=False)

    gender = Column(String(30), default=GenderEnum.NOT_SPECIFIED.value, nullable=False)
    contact = Column(String(15), nullable=False, unique=True)

    connections = relationship(
        "User",
        secondary=user_connections,
        primaryjoin=id == user_connections.c.user_id,
        secondaryjoin=id == user_connections.c.connection_id,
        backref="connected_to",
    )

    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)

    sender_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    receiver_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)

    content = Column(String, nullable=False)

    status = Column(String(30), default=MessageStatus.NOT_RECEIVED.value, nullable=False)

    is_deleted = Column(Boolean, default=False)

    sent_time = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
