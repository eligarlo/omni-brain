from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi import APIRouter

from models.settings import AppSettings
from routers import conversation, utilities
from constants import RouterName

app = FastAPI(
    title="Omni Brain API",
    description="API for Omni Brain, an AI assistant that can answer questions from different types of inputs.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=AppSettings().all_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, request_validation_exception_handler)


# ROUTERS
def get_router():
    """Get the API router."""
    router = APIRouter()
    router.include_router(
        utilities.router,
        prefix=f"/{RouterName.UTILITIES}",
        tags=[RouterName.UTILITIES],
    )
    router.include_router(
        conversation.router,
        prefix=f"/{RouterName.CONVERSATION}",
        tags=[RouterName.CONVERSATION],
    )
    return router


app.include_router(get_router())
