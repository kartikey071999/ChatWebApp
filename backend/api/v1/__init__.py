"""API v1 router."""

from fastapi import APIRouter
from .users import router as users_router
from .messages import router as messages_router
from .ws import router as ws_router

router = APIRouter(prefix="/api/v1")

router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(messages_router, prefix="/messages", tags=["messages"])

router.include_router(ws_router)

__all__ = ["router"]
