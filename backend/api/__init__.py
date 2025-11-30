"""API registration and basic config."""

import logging
from fastapi import FastAPI
from .v1 import router as v1_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend.api")


def register_api(app: FastAPI) -> None:
    """Attach v1 API router to the app."""
    app.include_router(v1_router)
    logger.info("API routes registered")


__all__ = ["register_api"]
