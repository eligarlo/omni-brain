from enum import Enum, StrEnum


class RouterName(StrEnum):
    """Router names."""

    CONVERSATION = "conversation"
    UTILITIES = "utilities"


class ConversationRole(str, Enum):
    """Enumeration of conversation roles.

    This enumeration represents the possible roles in a conversation, including user,
    assistant, and system
    """

    USER = "user"
    SYSTEM = "system"


class ConversationDescriptions(StrEnum):
    """Common descriptions for conversation model fields."""

    CONVERSATION_ID_DESCRIPTION = "Unique identifier for the conversation"
    ADDITIONAL_CONTEXT_DESCRIPTION = "Additional context to run agents"
    DATA_CONTEXT_DESCRIPTION = "Data context containing paths to data resources"
    LIST_SUGGESTED_PROMPTS = "List of suggested prompts for the session"
