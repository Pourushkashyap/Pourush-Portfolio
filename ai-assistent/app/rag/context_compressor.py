"""
Extractive context compressor (safety valve).

Only runs when the retrieved context is larger than the total budget. The
chunk header (Project / Section / Topic lines) is always kept, and the body
keeps its first sentence plus the sentences most relevant to the question,
in original order.
"""

import re

from langchain_core.documents import Document

STOPWORDS = {
    "the", "a", "an", "of", "on", "at", "in", "to", "and", "or", "is", "are",
    "was", "were", "what", "which", "who", "how", "does", "did", "do", "about",
    "with", "for", "me", "tell", "explain", "his", "her", "he", "she", "it",
    "this", "that", "s", "from", "by", "as", "be", "can", "has", "have",
}

HEADER_PREFIXES = ("Project:", "Section:", "Topic:")
_SPLIT = re.compile(r"(?<=[.!?])\s+|\n+")

MIN_DOC_CHARS = 400


def _tokens(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in STOPWORDS}


def _split_units(text: str) -> list[str]:
    return [u.strip() for u in _SPLIT.split(text) if u.strip()]


def _split_header(text: str) -> tuple[str, str]:
    lines = text.split("\n")
    count = 0

    while count < len(lines) and lines[count].startswith(HEADER_PREFIXES):
        count += 1

    return "\n".join(lines[:count]), "\n".join(lines[count:]).strip()


def compress_document(query: str, doc: Document, max_chars: int) -> Document:
    text = doc.page_content

    if len(text) <= max_chars:
        return doc

    header, body = _split_header(text)
    budget = max(200, max_chars - len(header) - 2)

    def build(body_text: str) -> Document:
        content = f"{header}\n\n{body_text}" if header else body_text
        return Document(page_content=content, metadata={**doc.metadata, "compressed": True})

    units = _split_units(body)

    if len(units) <= 2:
        return build(body[:budget].rstrip())

    query_tokens = _tokens(query)

    scored = [
        (len(query_tokens & _tokens(unit)) + (0.25 if re.search(r"\d", unit) else 0.0), i, unit)
        for i, unit in enumerate(units)
    ]

    selected = {0}  # the first sentence usually defines the topic
    used = len(units[0])

    for _, index, unit in sorted(scored, key=lambda s: (-s[0], s[1])):
        if index in selected or used + len(unit) + 1 > budget:
            continue
        selected.add(index)
        used += len(unit) + 1

    return build(" ".join(units[i] for i in sorted(selected)))


def compress_context(
    query: str,
    documents: list[Document],
    per_doc_chars: int = 1500,
    total_chars: int = 6000,
    skip_compression: bool = False,
) -> list[Document]:
    """Returns documents unchanged if they already fit in total_chars."""
    if skip_compression or not documents:
        return documents

    if sum(len(d.page_content) for d in documents) <= total_chars:
        return documents

    budget = max(MIN_DOC_CHARS, min(per_doc_chars, total_chars // len(documents)))

    return [
        doc if doc.metadata.get("no_compress") else compress_document(query, doc, budget)
        for doc in documents
    ]