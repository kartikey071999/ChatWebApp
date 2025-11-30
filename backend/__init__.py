"""Backend package init for ChatWebApp."""

__all__ = ["app", "create_app"]

from .app import app, create_app  # re-export for convenience
