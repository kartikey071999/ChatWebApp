"""Users API."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
import logging

from ...database import get_db
from ...models import User
from ...schemas import UserCreate, UserOut, LoginRequest
import enum

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create user."""
    db_user = User(
        username=user.username,
        email=user.email,
        password=user.password,
        first_name=user.first_name,
        middle_name=user.middle_name,
        last_name=user.last_name,
        gender=(user.gender.value if isinstance(user.gender, enum.Enum) else user.gender),
        contact=user.contact,
    )
    logger.info(f"Creating user: {user.username}")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/all", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    """List users."""
    users = db.query(User).all()
    # Normalize stored gender values to enum.value (lowercase) for response
    for u in users:
        if isinstance(u.gender, str):
            u.gender = u.gender.lower()
    return users


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get user by id."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if isinstance(db_user.gender, str):
        db_user.gender = db_user.gender.lower()
    return db_user


@router.post("/login", response_model=UserOut)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user."""
    if not request.email and not request.username:
        raise HTTPException(status_code=400, detail="Email or username required")

    user = None
    if request.email:
        user = db.query(User).filter(User.email == request.email).first()
    else:
        user = db.query(User).filter(User.username == request.username).first()

    if not user or user.password != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    logger.info(f"User logged in: {user.username}")
    if isinstance(user.gender, str):
        user.gender = user.gender.lower()
    return user
