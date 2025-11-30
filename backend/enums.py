import enum


class GenderEnum(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    NOT_SPECIFIED = "not_specified"


class MessageStatus(str, enum.Enum):
    NOT_RECEIVED = "not_received"
    RECEIVED = "received"
    READ = "read"
