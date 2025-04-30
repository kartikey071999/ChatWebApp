from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
# Database setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Create a simple database model for users
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

# Create a model for messages
class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

# Create the tables in the database
Base.metadata.create_all(bind=engine)

# FastAPI setup
app = FastAPI()

# Allow frontend to make requests to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic models to validate input
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    content: str

@app.post("/users/")
def create_user(user: UserCreate):
    db = SessionLocal()
    db_user = User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()
    return db_user

@app.get("/users/{user_id}")
def get_user(user_id: int):
    db = SessionLocal()
    db_user = db.query(User).filter(User.id == user_id).first()
    db.close()
    return db_user

@app.post("/messages/")
def send_message(message: MessageCreate):
    db = SessionLocal()
    # Create a new message
    db_message = Message(
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    db.close()
    return db_message

@app.get("/messages/{sender_id}/{receiver_id}")
def get_messages(sender_id: int, receiver_id: int):
    db = SessionLocal()
    # Retrieve messages between sender and receiver
    messages = db.query(Message).filter(
        (Message.sender_id == sender_id) & (Message.receiver_id == receiver_id) |
        (Message.sender_id == receiver_id) & (Message.receiver_id == sender_id)
    ).all()
    db.close()
    return messages


class LoginRequest(BaseModel):
    email: str | None = None
    username: str | None = None
    password: str

@app.post("/login")
def login(request: LoginRequest):
    db = SessionLocal()
    user = None
    if not request.email and not request.username:
        raise HTTPException(status_code=400, detail="Email or username required")
    if request.email:
        user = db.query(User).filter(User.email == request.email).first()
    else:
        user = db.query(User).filter(User.username == request.username).first()
    if not user or user.password != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    db.close()
    return user