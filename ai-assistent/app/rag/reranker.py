from functools import lru_cache
from pathlib import Path
from typing import List

from flashrank import Ranker, RerankRequest
from langchain_core.documents import Document

MODEL_NAME = "ms-marco-MiniLM-L-12-v2"

# Absolute path: the model is downloaded once, whatever folder you start from
CACHE_DIR = str(Path(__file__).resolve().parents[2] / "cache")

# FlashRank truncates passages at 128 tokens by default, which cuts chunks short.
MAX_LENGTH = 512


@lru_cache(maxsize=1)
def get_ranker() -> Ranker:
    """Loaded on first use, not at import time."""
    return Ranker(model_name=MODEL_NAME, cache_dir=CACHE_DIR, max_length=MAX_LENGTH)


def rerank_documents(
    query: str,
    documents: List[Document],
    top_k: int = 5,
) -> List[Document]:
    if not documents:
        return []

    passages = [
        {"id": str(i), "text": doc.page_content, "meta": doc.metadata}
        for i, doc in enumerate(documents)
    ]

    results = get_ranker().rerank(RerankRequest(query=query, passages=passages))

    reranked = []

    for result in results[:top_k]:
        score = result.get("score")

        reranked.append(
            Document(
                page_content=result["text"],
                metadata={
                    **result.get("meta", {}),
                    # FlashRank returns numpy.float32; store a plain float.
                    "rerank_score": float(score) if score is not None else None,
                },
            )
        )

    return reranked