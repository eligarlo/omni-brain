from typing import Annotated, Any

from pydantic import BeforeValidator, computed_field
from pydantic_settings import BaseSettings


def parse_list_strs(values: Any) -> list[str]:
    """Parse environment-provided list values into a clean list of strings.

    Accepts:
        - Already constructed lists
        - Comma-separated strings: "a,b,c"
        - Bracketed strings: "[a, b, c]" or with quotes

    Strips surrounding quotes per element and removes empty results.

    Args:
        values (Any): Raw input from environment/setting.

    Returns:
        list[str]: Normalized non-empty string list.

    Raises:
        TypeError: If the incoming value is neither a list nor a string.
    """

    def clean_value(value: str) -> str:
        """Clean value."""
        value = value.strip()
        for char in ["'", '"']:
            if value.startswith(char) and value.endswith(char):
                value = value[1:-1]
                break
        return value

    if isinstance(values, str):
        if values.startswith("[") and values.endswith("]"):
            # Handle string representation of a list
            values = values[1:-1]
        values = values.split(",")
    if isinstance(values, list):
        cleaned_values = [clean_value(i) for i in values]
        return [x for x in cleaned_values if x]  # Remove empty strings
    raise TypeError(values)


class AppSettings(BaseSettings):
    """FastAPI application settings loaded from environment variables.

    Attributes:
        FRONTEND_HOST (str): Deployed frontend base URL used for CORS augmentation.
        BACKEND_CORS_ORIGINS (list[str]): Allowed origins for CORS.
    """

    FRONTEND_HOST: str = ""

    BACKEND_CORS_ORIGINS: Annotated[list[str], BeforeValidator(parse_list_strs)] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
    ]

    @computed_field  # type: ignore[misc]
    @property
    def all_cors_origins(self) -> list[str]:
        """Return aggregate list of normalized CORS origins.

        Combines configured backend origins plus optional ``FRONTEND_HOST``.

        Returns:
            list[str]: Deduplicated origin list without trailing slashes.
        """
        origins = [str(x).rstrip("/") for x in self.BACKEND_CORS_ORIGINS]
        if self.FRONTEND_HOST and self.FRONTEND_HOST != "":
            origins.append(self.FRONTEND_HOST.rstrip("/"))
        return origins

