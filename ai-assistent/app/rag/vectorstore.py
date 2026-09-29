from pathlib import Path

from langchain_chroma import Chroma

from app.rag.embeddings import get_embeddings


CHROMA_DIR = Path("chroma_db")
COLLECTION_NAME = "pourush_portfolio"


def get_vectorstore() -> Chroma:
    embeddings = get_embeddings()

    vectorstore = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=str(CHROMA_DIR),
    )

    return vectorstore