from functools import lru_cache
from pathlib import Path

from langchain_community.vectorstores import FAISS

from app.rag.embeddings import get_embeddings

FAISS_DIR = Path("vector_store")


@lru_cache(maxsize=1)
def get_vectorstore() -> FAISS:
    """Loaded once per process (not on every query)."""
    return FAISS.load_local(
        str(FAISS_DIR),
        get_embeddings(),
        allow_dangerous_deserialization=True,  # only for an index you built yourself
    )