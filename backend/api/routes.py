"""DEPRECATED: Endpoints have been moved to v1 subpackage.

This file is kept for legacy reference only.
See `backend/api/v1/` for current route definitions.
"""

# Legacy import for backward compatibility
from .v1 import router

__all__ = ["router"]
