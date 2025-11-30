"""Run the backend API (APIs + WebSocket)."""
from __future__ import annotations

import argparse
import os
import platform
import sys
import uvicorn

# Ensure repo root is on path so `backend` package imports work when running
# the script directly from the backend folder or from the repo root.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Run ChatWebApp backend (APIs + WebSocket)")
    p.add_argument("--host", default=os.getenv("HOST", "127.0.0.1"), help="Host to bind")
    p.add_argument("--port", type=int, default=int(os.getenv("PORT", 8000)), help="Port to bind")
    p.add_argument(
        "--reload",
        action="store_true",
        default=os.getenv("RELOAD", "true").lower() in ("1", "true", "yes"),
        help="Enable code reload (development).",
    )
    p.add_argument("--log-level", default=os.getenv("LOG_LEVEL", "info"), help="uvicorn log level")
    return p.parse_args()


def _ensure_windows_event_loop_policy() -> None:
    if platform.system() == "Windows":
        try:
            import asyncio
            if hasattr(asyncio, "WindowsSelectorEventLoopPolicy"):
                asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        except Exception:
            pass


def _run():
    args = _parse_args()

    _ensure_windows_event_loop_policy()

    # When reload is enabled, pass the import string so Uvicorn can reload.
    if args.reload:
        uvicorn.run("backend.app:app", host=args.host, port=args.port, reload=args.reload, log_level=args.log_level)
    else:
        from backend.app import app
        uvicorn.run(app, host=args.host, port=args.port, reload=args.reload, log_level=args.log_level)


if __name__ == "__main__":
    _run()
