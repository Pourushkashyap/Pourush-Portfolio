from typing import List

from langchain_core.documents import Document

# Minimum cross-encoder score a chunk needs to be kept.
# Re-tune with tests/test_retriever.py after every re-ingest:
#   - out-of-scope questions still return chunks -> raise it
#   - good questions lose their right chunk      -> lower it
RELEVANCE_THRESHOLD = 0.15


def grade_context_relevance(
    documents: List[Document],
    threshold: float = RELEVANCE_THRESHOLD,
) -> List[Document]:
    """Drop chunks whose reranker score is below the threshold."""
    return [
        doc
        for doc in documents
        if (doc.metadata.get("rerank_score") or 0.0) >= threshold
    ]