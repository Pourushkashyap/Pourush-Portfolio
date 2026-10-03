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
    # =========================================================
    # USER / CONVERSATION
    # =========================================================

    query: str
    messages: list[BaseMessage]

    # Query after resolving conversation context
    contextualized_query: str

    # =========================================================
    # INTENT
    # =========================================================

    intent: Intent

    # =========================================================
    # QUERY TRANSFORMATION
    # =========================================================

    # Original query that enters the RAG pipeline
    original_query: str

    # One improved retrieval-friendly query
    rewritten_query: str

    # Multiple alternative formulations of the query
    expanded_queries: list[str]

    # Queries created when one question contains multiple
    # information needs
    sub_queries: list[str]

    # =========================================================
    # RETRIEVAL
    # =========================================================

    # Final retrieved context
    documents: list[Document]

    # =========================================================
    # ANSWERABILITY
    # =========================================================

    is_answerable: bool
    answerability_reason: str

    # =========================================================
    # GENERATION
    # =========================================================

    answer: str

    # =========================================================
    # VALIDATION
    # =========================================================

    is_grounded: bool
    validation_reason: str
    unsupported_claims: list[str]

    # =========================================================
    # RETRY / CORRECTIVE RAG
    # =========================================================

    attempts: int