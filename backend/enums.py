import enum


class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class MessageStatus(str, enum.Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
