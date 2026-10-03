import difflib
import logging
import re

from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

from langchain_core.documents import Document
from rank_bm25 import BM25Okapi

from app.rag.context_compressor import compress_context
from app.rag.context_grader import grade_context_relevance
from app.rag.reranker import rerank_documents
from app.rag.vectorstore import get_vectorstore

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_STOPWORDS = {
    "s", "his", "her", "he", "she", "him", "the", "a", "an", "of", "on", "at",
    "in", "to", "and", "or", "is", "are", "was", "were", "what", "which", "who",
    "how", "does", "did", "do", "about", "during", "with", "for", "me", "tell",
    "explain",
}

# Words appearing in more than this fraction of chunks are ignored by BM25.
AUTO_STOPWORD_DF = 0.5

# At most this many query variants are searched (original + rewritten +
# sub-queries + expansions, in that priority order).
MAX_QUERIES = 5

LIST_QUERY = re.compile(
    r"\bprojects\b|\bwhat (has|have) (he|she|they) (built|made|created)\b",
    re.IGNORECASE,
)

# "projects" questions that need details, not just the list of projects
LIST_EXCLUDE = re.compile(
    r"\b(future|roadmap|plans?|next|learning|intern\w*|technolog\w*|stack|"
    r"tools?|skills?|languages?|frameworks?|using|with)\b",
    re.IGNORECASE,
)

CONTACT_HINT = re.compile(
    r"\b(email|e-mail|mail|linkedin|github|leetcode|phone|mobile|whatsapp|contact)\b",
    re.IGNORECASE,
)

BROAD_QUERY = re.compile(
    r"\bend[- ]to[- ]end\b|\barchitecture\b|\bhow does .* work\b"
    r"|\bhow is .* built\b|\bexplain\b|\bworkflow\b|\bimplementation\b",
    re.IGNORECASE,
)

FUZZY_CUTOFF = 0.88
MIN_ALIAS_LEN = 5

# Rare-word anchors: a query word found in only a few chunks pulls them in.
ANCHOR_MAX_DF = 3
ANCHOR_MIN_LEN = 5
ANCHOR_FUZZY_CUTOFF = 0.85
ANCHOR_MAX_DOCS = 2
ANCHOR_IGNORE_TERMS = {"pourush", "kashyap"}


# Intent rules add chunks to the candidate pool (the reranker still decides).
# "titles" are matched against "<section title> <sub-section>" of each chunk.
INTENT_RULES = [
    {
        "query": re.compile(r"\b(future|roadmap|upcoming|next steps?|plans?)\b", re.I),
        "titles": ("future", "roadmap", "career goals"),
    },
    {
        "query": re.compile(
            r"\b(technolog\w*|tech stack|stack|skills?|tools?|languages?|frameworks?)\b",
            re.I,
        ),
        "titles": ("skill", "technology stack"),
    },
    {
        "query": re.compile(
            r"currently learning|learning now|current focus|currently working"
            r"|focus(ed|ing)? on|\b(award|awards|achievement|achievements|won|"
            r"winner|hackathon)\b",
            re.I,
        ),
        "titles": ("achievement", "career goals", "learning journey"),
    },
    {
        "query": re.compile(
            r"\bwho is\b|\bintroduce\b|\babout (him|her|them)\b|"
            r"\btell me about (him|her|them)\b",
            re.I,
        ),
        "titles": ("about",),
    },
    {
        "query": re.compile(
            r"\b(stud(y|ied)|education|college|university|degree|cgpa|gpa|academic)\b",
            re.I,
        ),
        "titles": ("education",),
    },
    {
        "query": re.compile(
            r"\b(dsa|leetcode|codeforces|codechef|competitive|problems? solved|"
            r"solved|contests?|rating)\b",
            re.I,
        ),
        "titles": ("achievement",),
    },
    {
        "query": re.compile(r"\binternships?\b|\bintern\b", re.I),
        "titles": (),
        "content": r"\binternship\b|\bintern\b",
    },
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def compact(text: str) -> str:
    """'Self-Healing Debugger' -> 'selfhealingdebugger'"""
    return re.sub(r"[^a-z0-9]", "", text.lower())


def project_canon(name: str) -> str:
    """Canonical project key; a trailing ' AI' is ignored."""
    return compact(re.sub(r"\s+AI$", "", name.strip(), flags=re.I))


def doc_key(doc: Document) -> tuple:
    return (
        doc.metadata.get("page"),
        doc.metadata.get("section_number"),
        doc.metadata.get("chunk_index"),
        doc.page_content,
    )


def dedupe(documents: list[Document]) -> list[Document]:
    seen = set()
    unique = []

    for doc in documents:
        key = doc_key(doc)
        if key not in seen:
            seen.add(key)
            unique.append(doc)

    return unique


def is_project_chunk(doc: Document) -> bool:
    return doc.metadata.get("section_type") == "project"


def sort_key(doc: Document) -> tuple:
    return (
        doc.metadata.get("section_number", 0),
        doc.metadata.get("chunk_index", 0),
    )


# ---------------------------------------------------------------------------
# Index (built once and cached)
# ---------------------------------------------------------------------------

def get_all_documents() -> list[Document]:
    vectorstore = get_vectorstore()
    documents = []

    for doc_id in vectorstore.index_to_docstore_id.values():
        document = vectorstore.docstore.search(doc_id)
        if document is not None:
            documents.append(document)

    return documents


@lru_cache(maxsize=1)
def get_bm25_index() -> tuple[list[Document], BM25Okapi | None, set[str]]:
    documents = get_all_documents()

    if not documents:
        return [], None, set(BASE_STOPWORDS)

    raw_tokens = [tokenize(doc.page_content) for doc in documents]

    doc_freq: Counter = Counter()
    for tokens in raw_tokens:
        doc_freq.update(set(tokens))

    auto_stop = set()
    if len(documents) >= 10:
        auto_stop = {
            token
            for token, df in doc_freq.items()
            if df / len(documents) > AUTO_STOPWORD_DF
        }

    stopwords = BASE_STOPWORDS | auto_stop

    tokenized = [
        [t for t in tokens if t not in stopwords] or ["_empty_"]
        for tokens in raw_tokens
    ]

    return documents, BM25Okapi(tokenized), stopwords


@lru_cache(maxsize=1)
def get_term_stats() -> tuple[Counter, list[set[str]]]:
    documents, _, _ = get_bm25_index()
    token_sets = [set(tokenize(doc.page_content)) for doc in documents]

    doc_freq: Counter = Counter()
    for tokens in token_sets:
        doc_freq.update(tokens)

    return doc_freq, token_sets


@lru_cache(maxsize=1)
def get_project_alias_map() -> dict[str, set[str]]:
    """Project aliases come from the 'project_name' metadata, nothing is hard-coded."""
    documents, _, _ = get_bm25_index()
    result: dict[str, set[str]] = {}

    for doc in documents:
        name = doc.metadata.get("project_name")
        if not name:
            continue

        aliases = {a for a in (compact(name), project_canon(name)) if len(a) >= MIN_ALIAS_LEN}
        if aliases:
            result.setdefault(project_canon(name), set()).update(aliases)

    return result


def get_project_names() -> list[str]:
    """Names of all projects found in the knowledge base (used by the intent router)."""
    documents, _, _ = get_bm25_index()
    return sorted({d.metadata["project_name"] for d in documents if d.metadata.get("project_name")})


def project_aliases(name: str) -> set[str]:
    return {a for a in (compact(name), project_canon(name)) if len(a) >= MIN_ALIAS_LEN}


def clear_bm25_cache() -> None:
    """Call after re-ingesting in a long-running process."""
    get_bm25_index.cache_clear()
    get_term_stats.cache_clear()
    get_project_alias_map.cache_clear()

    if hasattr(get_vectorstore, "cache_clear"):
        get_vectorstore.cache_clear()


def bm25_tokenize(text: str) -> list[str]:
    _, _, stopwords = get_bm25_index()
    return [t for t in tokenize(text) if t not in stopwords]


# ---------------------------------------------------------------------------
# Basic retrievers
# ---------------------------------------------------------------------------

def get_semantic_documents(query: str, k: int = 5) -> list[Document]:
    try:
        results = get_vectorstore().similarity_search(query, k=k * 2)
    except Exception:
        # e.g. embedding API failure: keyword search still works
        logger.exception("Semantic search failed; falling back to BM25 only")
        return []

    return [d for d in results if d.metadata.get("retrieval_allowed", True)][:k]


def get_bm25_documents(query: str, k: int = 5) -> list[Document]:
    documents, bm25, _ = get_bm25_index()

    if not documents or bm25 is None:
        return []

    query_tokens = bm25_tokenize(query)
    if not query_tokens:
        return []

    scores = bm25.get_scores(query_tokens)
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]

    return [
        documents[i]
        for i in ranked
        if scores[i] > 0 and documents[i].metadata.get("retrieval_allowed", True)
    ]


def reciprocal_rank_fusion(result_lists: list[list[Document]], k: int = 60) -> list[Document]:
    """Used only to build the candidate pool; the reranker makes the final ranking."""
    scores: dict = {}
    documents: dict = {}

    for result_list in result_lists:
        for rank, document in enumerate(result_list):
            key = doc_key(document)
            documents[key] = document
            scores[key] = scores.get(key, 0.0) + 1.0 / (k + rank + 1)

    return [documents[key] for key in sorted(scores, key=scores.get, reverse=True)]


# ---------------------------------------------------------------------------
# Project detection and scoping
# ---------------------------------------------------------------------------

def find_mentioned_projects(query: str) -> set[str]:
    tokens = tokenize(query)

    windows = set()
    for size in range(1, 5):
        for start in range(len(tokens) - size + 1):
            windows.add("".join(tokens[start:start + size]))

    mentioned = set()

    for canon, aliases in get_project_alias_map().items():
        for alias in aliases:
            if alias in windows:
                mentioned.add(canon)
                break

            if len(alias) >= 7 and difflib.get_close_matches(
                alias, windows, n=1, cutoff=FUZZY_CUTOFF
            ):
                mentioned.add(canon)
                break

    return mentioned


def get_project_documents(canon_keys: set[str]) -> dict[str, list[Document]]:
    documents, _, _ = get_bm25_index()
    grouped: dict[str, list[Document]] = {key: [] for key in canon_keys}

    for doc in documents:
        name = doc.metadata.get("project_name")

        if not name or not doc.metadata.get("retrieval_allowed", True):
            continue

        canon = project_canon(name)
        if canon in grouped:
            grouped[canon].append(doc)

    for docs in grouped.values():
        docs.sort(key=sort_key)

    return grouped


def scope_to_projects(candidates: list[Document], mentioned: set[str]) -> list[Document]:
    """
    When the question names a project: drop other projects' chunks and make sure
    every chunk of the named project is a candidate.
    """
    if not mentioned:
        return candidates

    own = [d for docs in get_project_documents(mentioned).values() for d in docs]

    kept = [
        d
        for d in candidates
        if not d.metadata.get("project_name")
        or project_canon(d.metadata["project_name"]) in mentioned
    ]

    return dedupe(kept + own)


def get_project_list_documents() -> list[Document]:
    """For 'what projects has he built?': the overview section + each project's intro."""
    documents, _, _ = get_bm25_index()

    overview = [
        d for d in documents
        if d.metadata.get("section_title", "").lower().startswith("projects overview")
    ]
    intros = sorted(
        (d for d in documents if is_project_chunk(d) and d.metadata.get("subsection") == "Overview"),
        key=sort_key,
    )

    return overview + intros


# ---------------------------------------------------------------------------
# Contact / intent / anchor candidate signals
# ---------------------------------------------------------------------------

def get_contact_documents(query: str) -> list[Document]:
    if not CONTACT_HINT.search(query):
        return []

    documents, _, _ = get_bm25_index()

    return [
        Document(
            page_content=doc.page_content,
            metadata={**doc.metadata, "no_compress": True},
        )
        for doc in documents
        if "contact" in doc.metadata.get("section_title", "").lower()
    ]


def get_intent_documents(query: str) -> list[Document]:
    documents, _, _ = get_bm25_index()
    matched: list[Document] = []

    for rule in INTENT_RULES:
        if not rule["query"].search(query):
            continue

        titles = rule.get("titles", ())
        content = re.compile(rule["content"], re.I) if rule.get("content") else None

        for doc in documents:
            label = (
                f"{doc.metadata.get('section_title', '')} "
                f"{doc.metadata.get('subsection') or ''}"
            ).lower()

            if any(t in label for t in titles) or (content and content.search(doc.page_content)):
                matched.append(doc)

    return matched


def get_anchor_documents(query: str) -> list[Document]:
    """A rare word in the question (found in few chunks) pulls those chunks in."""
    documents, _, stopwords = get_bm25_index()
    doc_freq, token_sets = get_term_stats()

    if not documents:
        return []

    vocab = list(doc_freq)
    anchors: set[str] = set()

    for token in set(tokenize(query)):
        if len(token) < ANCHOR_MIN_LEN or token in stopwords or token in ANCHOR_IGNORE_TERMS:
            continue

        if token in doc_freq:
            if doc_freq[token] <= ANCHOR_MAX_DF:
                anchors.add(token)
            continue

        close = difflib.get_close_matches(token, vocab, n=1, cutoff=ANCHOR_FUZZY_CUTOFF)
        if close and doc_freq[close[0]] <= ANCHOR_MAX_DF:
            anchors.add(close[0])

    if not anchors:
        return []

    matched = [doc for doc, tokens in zip(documents, token_sets) if anchors & tokens]
    matched.sort(key=lambda d: (0 if is_project_chunk(d) else 1, *sort_key(d)))

    return matched[:ANCHOR_MAX_DOCS]


# ---------------------------------------------------------------------------
# Query preparation
# ---------------------------------------------------------------------------

def build_retrieval_queries(
    query: str,
    rewritten_query: str | None = None,
    expanded_queries: list[str] | None = None,
    sub_queries: list[str] | None = None,
) -> list[str]:
    """
    Priority order: original, rewritten, sub-queries (multi-part questions),
    then expansions. Duplicates removed, capped at MAX_QUERIES.
    """
    candidates = [query, rewritten_query, *(sub_queries or []), *(expanded_queries or [])]

    queries: list[str] = []

    for candidate in candidates:
        if not isinstance(candidate, str):
            continue

        candidate = candidate.strip()

        if candidate and all(candidate.lower() != q.lower() for q in queries):
            queries.append(candidate)

    return queries[:MAX_QUERIES]


# ---------------------------------------------------------------------------
# Main retrieval
# ---------------------------------------------------------------------------

def retrieve_documents(
    query: str,
    rewritten_query: str | None = None,
    expanded_queries: list[str] | None = None,
    sub_queries: list[str] | None = None,
    k: int = 5,
    compress: bool = True,
) -> list[Document]:
    """
    queries -> (vector + BM25, in parallel) -> RRF -> + candidate signals
    -> project scoping -> cross-encoder rerank -> relevance gate -> top-k
    -> context compression (only if over budget).
    """
    query = query.strip()
    if not query:
        return []

    retrieval_queries = build_retrieval_queries(
        query, rewritten_query, expanded_queries, sub_queries
    )

    mentioned = find_mentioned_projects(query)

    # "What projects has he built?" -> project list, no ranking needed
    if not mentioned and LIST_QUERY.search(query) and not LIST_EXCLUDE.search(query):
        listing = get_project_list_documents()
        if listing:
            return listing

    broad = bool(BROAD_QUERY.search(query))
    candidate_k = max(k * 3, 15)

    def search(q: str) -> list[list[Document]]:
        return [
            get_semantic_documents(q, k=candidate_k),
            get_bm25_documents(q, k=candidate_k),
        ]

    with ThreadPoolExecutor(max_workers=len(retrieval_queries)) as pool:
        result_lists = [lst for pair in pool.map(search, retrieval_queries) for lst in pair]

    fused = [
        d for d in reciprocal_rank_fusion(result_lists)
        if d.metadata.get("section_type") != "preamble"
    ]

    candidates = dedupe(
        fused
        + get_anchor_documents(query)
        + get_intent_documents(query)
        + get_contact_documents(query)
    )

    candidates = scope_to_projects(candidates, mentioned)

    if not candidates:
        return []

    # The cross-encoder is the final judge of relevance.
    reranked = rerank_documents(
        query=query,
        documents=candidates,
        top_k=min(candidate_k, len(candidates)),
    )

    reranked.sort(key=lambda d: d.metadata.get("rerank_score") or 0.0, reverse=True)

    reranked = grade_context_relevance(reranked)
    if not reranked:
        return []

    final_documents = reranked[:k]

    if compress:
        final_documents = compress_context(
            query=query,
            documents=final_documents,
            skip_compression=broad,
        )

    return final_documents