import os

from dotenv import load_dotenv
from fastapi import APIRouter

from constants import RouterName

router = APIRouter()

load_dotenv()


@router.get("/", tags=[RouterName.UTILITIES])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Omni Brain API"}


@router.get("/check-langfuse", tags=[RouterName.UTILITIES])
def check_langfuse_connection():
    """Check if the Langfuse connection is properly configured and authenticated."""
    try:
        from langfuse import Langfuse
    except ImportError as e:
        return {"status": "error", "message": f"Failed to import langfuse: {e}"}

    try:
        lf = Langfuse(
            public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
            secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
            host=os.getenv("LANGFUSE_HOST"),
        )
        is_auth = lf.auth_check()
        return {"status": "ok", "authenticated": is_auth}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# CHAT TEST
@router.get("/chat-test", tags=[RouterName.UTILITIES])
def chat_test(question: str = "Briefly explain what a trace is in LLM observability."):
    """Execute a test query against OpenAI with Langfuse tracing."""
    try:
        from langfuse import Langfuse
        from langfuse.openai import openai
    except ImportError as e:
        return {"status": "error", "message": f"Failed to import dependencies: {e}"}

    model = os.getenv("OPENAI_MODEL", "gpt-5-nano")

    try:
        response = openai.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert programming assistant.",
                },
                {"role": "user", "content": question},
            ],
        )
        llm_response_message = response.choices[0].message.content

        Langfuse().flush()

        return {
            "status": "ok",
            "model": model,
            "response": response,
            "llm_response_message": llm_response_message,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
