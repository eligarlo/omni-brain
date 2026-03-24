import uuid

from pydantic import (
    BaseModel,
    Field,
)

from constants import (
    ConversationDescriptions,
    ConversationRole,
)


class ConversationQueryCreate(BaseModel):
    """Single inbound user/assistant/system message payload.

    Attributes:
        message_id (uuid.UUID): Unique identifier for the message.
        role (ConversationRole): Source role for the message (user, assistant, system).
        query (str): Raw textual query content.
        image_data (bytes | None):
        Optional binary image data associated with the message.
    """

    message_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        description=ConversationDescriptions.CONVERSATION_ID_DESCRIPTION,
    )
    role: ConversationRole = Field(
        default=ConversationRole.USER,
        description="Role of the message sender (user, assistant, system)",
    )
    query: str = Field(description="Query text for the conversation message")

    image_data: bytes | None = Field(
        default=None, description="Binary data for the uploaded image"
    )

    is_from_suggestion: bool | None = Field(
        default=None,
        description=(
            "True if the query was selected from follow_up_suggestions. "
            "When True, the FollowUpAgent is skipped for optimization."
        ),
    )
