import base64
import uuid

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
    logger,
    status,
)
from fastapi.responses import StreamingResponse

from models.conversation import ConversationQueryCreate
from services.conversation import execute_ia_query

router = APIRouter()


@router.post("/query")
async def execute_workflow_query(
    conversation_id: uuid.UUID,
    message_id: uuid.UUID = Form(default_factory=uuid.uuid4),
    role: str = Form(default="user"),
    query: str = Form(...),
    images: UploadFile = File(default=None),
):
    """
    Endpoint to handle AI queries.

    Args:
        conversation_id (uuid.UUID): The unique identifier for the conversation.
        message_id (uuid.UUID): The unique identifier for the message.
        role (str): The role of the message sender.
        query (str): The query text to execute.
        images (UploadFile, optional): Optional file upload for images.

    Returns:
        dict: The AI's response.
    """

    # Validate uploaded file is an image
    encoded_string = None
    if images and images.filename:
        if not images.content_type or not images.content_type.startswith("image/"):
            logger.error("Invalid file type uploaded: %s", images.content_type)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only image files are allowed",
            )

        logger.info("Received image file: %s", images.filename)
        encoded_string = base64.b64encode(images.file.read()).decode("utf-8")

    # Create query object
    query_create = ConversationQueryCreate(
        message_id=message_id, role=role, query=query, image_data=encoded_string
    )

    response = execute_ia_query(query)

    return {"response": response}
