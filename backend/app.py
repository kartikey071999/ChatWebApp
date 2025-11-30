"""Create and configure the FastAPI app."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.exceptions import ResponseValidationError
from fastapi import HTTPException
import traceback
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .api import register_api

init_db()


def create_app() -> FastAPI:
    """Return configured FastAPI application."""
    app = FastAPI(
        title="ChatWebApp API",
        description="A real-time chat application backend",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"error": "validation_error", "detail": exc.errors()},
        )

    @app.exception_handler(ResponseValidationError)
    async def response_validation_handler(request: Request, exc: ResponseValidationError):
        # Response validation failures are typically server-side issues where
        # the returned data does not match the response model. Return details
        # so callers can debug (acceptable in dev/testing per user request).
        return JSONResponse(
            status_code=500,
            content={"error": "response_validation_error", "detail": exc.errors()},
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": "http_error", "detail": exc.detail},
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        tb = traceback.format_exc()
        return JSONResponse(
            status_code=500,
            content={"error": "internal_server_error", "detail": str(exc), "trace": tb},
        )

    register_api(app)

    return app


# Export an app instance for servers/tools that expect `app`
app = create_app()
