import re
from functools import lru_cache

from langchain_core.documents import Document
from rank_bm25 import BM25Okapi

from app.rag.query_expander import expand_query
from app.rag.vectorstore import get_vectorstore


# Words that appear in almost every chunk or every question and carry no signal
BM25_STOPWORDS = {
    "pourush", "kashyap", "s", "his", "he", "him", "the", "a", "an", "of", "on",
    "at", "in", "to", "and", "or", "is", "are", "was", "were", "what", "which",
    "who", "how", "does", "did", "do", "about", "during", "with", "for", "me",
    "tell", "explain",
}

# Spelling variants that should count as the same word in keyword search
TOKEN_ALIASES = {
    "solitaire": "solitair",
}

# "List all his projects" style questions (plural "projects" only, so
# "which project did he complete during his internship" is not affected)
LIST_QUERY = re.compile(r"\bprojects\b", re.IGNORECASE)
LIST_EXCLUDE = re.compile(
    r"\b(future|roadmap|plans?|next|learning|intern\w*|solitair\w*)\b",
    re.IGNORECASE,
)

# Questions that mention contact details always get the contact chunk too
CONTACT_HINT = re.compile(
    r"\b(email|e-mail|mail|linkedin|github|leetcode|phone|mobile|whatsapp|contact)\b",
    re.IGNORECASE,
)

CATALOG_CHARS = 500


def _title_contains(text: str):
    """Match chunks whose section_title contains the given text."""
    needle = text.lower()
    return lambda doc: needle in doc.metadata.get("section_title", "").lower()


def _content_matches(pattern: str):
    """Match chunks whose text matches the given regex."""
    regex = re.compile(pattern, re.IGNORECASE)
    return lambda doc: bool(regex.search(doc.page_content))


# Intent rules: if the question matches "query", the chunks selected by "match"
# are placed first (rules are applied in this order).
INTENT_RULES = [
    {   # internship / company -> Crime Scene Detection (+ correction chunk)
        "query": re.compile(
            r"solitair"
            r"|intern\w*\b.*\b(project|work|worked|built|build|complete|completed|did|done)\b"
            r"|\b(project|work|worked|built|build|complete|completed|did|done)\b.*intern",
            re.IGNORECASE,
        ),
        "match": _content_matches(r"internship project|solitair infosys"),
    },
    {   # future plans / roadmap -> portfolio-wide roadmap
        "query": re.compile(
            r"\b(future|roadmap|upcoming|next steps?|plans?)\b", re.IGNORECASE
        ),
        "match": _title_contains("Portfolio-Wide Future Roadmap"),
    },
    {   # technologies / skills / stack -> skill map
        "query": re.compile(
            r"\b(technolog\w*|tech stack|stack|skills?|tools?|languages?|frameworks?)\b",
            re.IGNORECASE,
        ),
        "match": _title_contains("Technical Skill Map"),
    },
    {   # currently learning / focus -> achievements & current focus
        "query": re.compile(
            r"currently learning|learning now|current focus|currently working|focus(ed|ing)? on",
            re.IGNORECASE,
        ),
        "match": _title_contains("Achievements"),
    },
    {   # who is / introduction -> overview
        "query": re.compile(
            r"\bwho is\b|\bintroduce\b|\babout pourush\b|\btell me about (him|pourush)\b",
            re.IGNORECASE,
        ),
        "match": _title_contains("Overview"),
    },
]


def tokenize(text: str) -> list[str]:
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    return [TOKEN_ALIASES.get(token, token) for token in tokens]


def bm25_tokenize(text: str) -> list[str]:
    return [token for token in tokenize(text) if token not in BM25_STOPWORDS]


def compact(text: str) -> str:
    """'Self-Healing Debugger' and 'self healing debugger' both become 'selfhealingdebugger'."""
    return re.sub(r"[^a-z0-9]", "", text.lower())


def project_aliases(name: str) -> set[str]:
    """Compact forms of a project name, also without a trailing ' AI'."""
    aliases = {compact(name), compact(re.sub(r"\s+AI$", "", name))}
    return {alias for alias in aliases if len(alias) >= 6}


def get_all_documents():
    vectorstore = get_vectorstore()

    documents = []

    for doc_id in vectorstore.index_to_docstore_id.values():
        document = vectorstore.docstore.search(doc_id)

        if document is not None:
            documents.append(document)

    return documents


@lru_cache(maxsize=1)
def get_bm25_index() -> tuple[list[Document], BM25Okapi | None]:
    """Build the BM25 index once instead of on every query."""
    documents = get_all_documents()

    if not documents:
        return [], None

    tokenized = [bm25_tokenize(doc.page_content) for doc in documents]
    return documents, BM25Okapi(tokenized)


def clear_bm25_cache() -> None:
    """Call this after re-ingesting inside a long-running process."""
    get_bm25_index.cache_clear()


def get_project_names() -> list[str]:
    """Project names read from the knowledge base (nothing hard-coded)."""
    documents, _ = get_bm25_index()

    return sorted(
        {
            doc.metadata["project_name"]
            for doc in documents
            if doc.metadata.get("project_name")
        }
    )


def get_semantic_documents(query: str, k: int = 5) -> list[Document]:
    vectorstore = get_vectorstore()

    results = vectorstore.similarity_search(query, k=k + 3)

    return [
        doc for doc in results if doc.metadata.get("retrieval_allowed", True)
    ][:k]


def get_bm25_documents(query: str, k: int = 5) -> list[Document]:
    documents, bm25 = get_bm25_index()

    if not documents or bm25 is None:
        return []

    query_tokens = bm25_tokenize(query)

    if not query_tokens:
        return []

    scores = bm25.get_scores(query_tokens)

    ranked = sorted(
        range(len(scores)),
        key=lambda index: scores[index],
        reverse=True,
    )[:k]

    # Skip zero-score documents so unrelated chunks never enter the fusion
    return [documents[index] for index in ranked if scores[index] > 0]


def reciprocal_rank_fusion(
    result_lists: list[list[Document]],
    k: int = 60,
) -> list[Document]:
    scores: dict = {}
    documents: dict = {}

    for result_list in result_lists:
        for rank, document in enumerate(result_list):
            document_id = (
                document.metadata.get("source", ""),
                document.metadata.get("page", ""),
                document.metadata.get("chunk_index", ""),
                document.page_content,
            )

            documents[document_id] = document
            scores[document_id] = scores.get(document_id, 0) + 1 / (k + rank + 1)

    ranked_ids = sorted(scores, key=scores.get, reverse=True)

    return [documents[document_id] for document_id in ranked_ids]


def get_mentioned_project_documents(query: str) -> list[Document]:
    """
    If the question names a project (e.g. "SilentSOS", "codepilot",
    "self healing debugger"), return all chunks of that project in reading order.
    """
    documents, _ = get_bm25_index()
    compact_query = compact(query)

    mentioned = {
        name
        for name in get_project_names()
        if any(alias in compact_query for alias in project_aliases(name))
    }

    if not mentioned:
        return []

    project_docs = [
        doc for doc in documents if doc.metadata.get("project_name") in mentioned
    ]

    project_docs.sort(
        key=lambda doc: (
            doc.metadata.get("section_number", 0),
            doc.metadata.get("chunk_index", 0),
        )
    )

    return project_docs


def get_project_catalog_documents() -> list[Document]:
    """
    One short summary chunk per project (heading + one-line description +
    start of the problem statement), in reading order.
    """
    documents, _ = get_bm25_index()

    catalog = [
        doc
        for doc in documents
        if doc.metadata.get("chunk_index", 0) == 0
        and (
            doc.metadata.get("section_type") == "project"
            or "portfolio website" in doc.metadata.get("section_title", "").lower()
        )
    ]

    catalog.sort(key=lambda doc: doc.metadata.get("section_number", 0))

    return [
        Document(
            page_content=doc.page_content[:CATALOG_CHARS].rstrip(),
            metadata=dict(doc.metadata),
        )
        for doc in catalog
    ]


def get_contact_documents(query: str) -> list[Document]:
    """The contact chunk, only when the question mentions contact details."""
    if not CONTACT_HINT.search(query):
        return []

    documents, _ = get_bm25_index()

    return [
        doc
        for doc in documents
        if "contact & professional identity"
        in doc.metadata.get("section_title", "").lower()
    ]


def get_intent_documents(query: str) -> list[Document]:
    """Chunks that must come first for special question types."""
    documents, _ = get_bm25_index()
    matched: list[Document] = []

    for rule in INTENT_RULES:
        if not rule["query"].search(query):
            continue

        rule_docs = [doc for doc in documents if rule["match"](doc)]

        # Inside one rule: full project chunks first, then reading order
        rule_docs.sort(
            key=lambda doc: (
                0 if doc.metadata.get("section_type") == "project" else 1,
                doc.metadata.get("page", 0),
                doc.metadata.get("chunk_index", 0),
            )
        )

        matched.extend(rule_docs)

    return matched


def dedupe(documents: list[Document]) -> list[Document]:
    seen = set()
    unique = []

    for doc in documents:
        doc_id = (
            doc.metadata.get("page"),
            doc.metadata.get("section_number"),
            doc.metadata.get("chunk_index"),
            doc.page_content,
        )

        if doc_id in seen:
            continue

        seen.add(doc_id)
        unique.append(doc)

    return unique


def retrieve_documents(
    query: str,
    k: int = 5,
    use_expansion: bool = True,
) -> list[Document]:
    # 1) A named project returns only that project's chunks, in reading order
    named_project_docs = get_mentioned_project_documents(query)

    if named_project_docs:
        return dedupe(named_project_docs)[:k]

    # 2) "List his projects": one summary chunk per project, no k cut-off
    if LIST_QUERY.search(query) and not LIST_EXCLUDE.search(query):
        catalog = get_project_catalog_documents()

        if catalog:
            return dedupe(catalog + get_contact_documents(query))

    # 3) Hybrid search: semantic + BM25 over the query and its expansions
    queries = [query]

    if use_expansion:
        try:
            queries.extend(expand_query(query))
        except Exception:
            # If the LLM call fails, fall back to the original query only
            pass

    result_lists: list[list[Document]] = []

    for q in queries:
        result_lists.append(get_semantic_documents(q, k=k))
        result_lists.append(get_bm25_documents(q, k=k))

    fused = reciprocal_rank_fusion(result_lists)

    # 4) Overview / Source Corrections are filler for most questions.
    #    They come back only through an intent rule (internship, "who is").
    fused = [
        doc for doc in fused
        if doc.metadata.get("section_type") != "preamble"
    ]

    # 5) Intent chunks first, fused results next, contact chunk if requested
    results = dedupe(get_intent_documents(query) + fused)[:k]

    return dedupe(results + get_contact_documents(query))