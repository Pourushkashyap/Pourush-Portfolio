from pathlib import Path

from langchain_community.vectorstores import FAISS

from app.rag.embeddings import get_embeddings


FAISS_DIR = Path("vector_store")


def get_vectorstore() -> FAISS:
    embeddings = get_embeddings()

    vectorstore = FAISS.load_local(
        str(FAISS_DIR),
        embeddings,
        allow_dangerous_deserialization=True,
    )

    return vectorstore