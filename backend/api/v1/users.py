"""User management endpoints."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import logging

from ...database import get_db
from ...models import User
from ...schemas import UserRegister, UserLogin, UserOut
from ...crypto import encrypt_password, verify_password
from ...enums import RoleEnum

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user. Role may be set in the request body (default: user)."""
    existing = db.query(User).filter(User.name == user_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Determine requested role, default to USER
    requested_role = user_data.role if getattr(user_data, "role", None) is not None else RoleEnum.USER
    if isinstance(requested_role, str):
        try:
            requested_role = RoleEnum(requested_role)
        except Exception:
            requested_role = RoleEnum.USER

    encrypted_pwd = encrypt_password(user_data.password)
    new_user = User(name=user_data.name, password=encrypted_pwd, role=requested_role.value)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"User registered: {new_user.name} (role={new_user.role})")
    return new_user


@router.post("/login", response_model=UserOut)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    """Login user."""
    user = db.query(User).filter(User.name == creds.name).first()
    if not user or not verify_password(user.password, creds.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    logger.info(f"User logged in: {user.name}")
    return user


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db)):
    """List all users."""
    return db.query(User).all()
