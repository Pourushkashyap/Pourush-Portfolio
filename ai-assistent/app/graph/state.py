from typing import Literal, TypedDict

from langchain_core.documents import Document
from langchain_core.messages import BaseMessage


Intent = Literal[
    "casual",
    "portfolio",
    "contact",
    "other",
]


class ChatState(TypedDict, total=False):
    query: str
    messages: list[BaseMessage]

    intent: Intent

    documents: list[Document]

    answer: str
    attempts: int

    is_answerable: bool
    answerability_reason: str
    contextualized_query: str
    is_grounded: bool
    validation_reason: str
    unsupported_claims: list[str]