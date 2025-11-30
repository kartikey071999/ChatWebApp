"""API v1 router aggregation."""

from fastapi import APIRouter
from .users import router as users_router
from .channels import router as channels_router
from .messages import router as messages_router
from .ws import router as ws_router

router = APIRouter(prefix="/api/v1")

# Include all sub-routers
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(channels_router, prefix="/channels", tags=["channels"])
router.include_router(messages_router, prefix="/messages", tags=["messages"])
router.include_router(ws_router, tags=["websocket"])
