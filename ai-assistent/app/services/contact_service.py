import re
from functools import lru_cache

from app.rag.retriever import get_all_documents

NOT_FOUND = "I don't have that information in Pourush's portfolio/project knowledge base."

CONTACT_SECTION = "contact & professional identity"

# Extracted from the knowledge-base text, nothing is hard-coded here
PATTERNS = {
    "email": r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+",
    "phone": r"\+\d[\d ]{7,}\d",
    "github": r"https://github\.com/\S+",
    "linkedin": r"https://www\.linkedin\.com/in/\S+",
    "leetcode": r"https://leetcode\.com/u/\S+",
}

LABELS = {
    "email": "Email",
    "phone": "Phone",
    "github": "GitHub",
    "linkedin": "LinkedIn",
    "leetcode": "LeetCode",
}

KEYWORDS = {
    "email": ("email", "e-mail", "mail"),
    "phone": ("phone", "number", "call", "mobile", "whatsapp"),
    "github": ("github",),
    "linkedin": ("linkedin",),
    "leetcode": ("leetcode",),
}


@lru_cache(maxsize=1)
def get_contact_info() -> dict[str, str]:
    """Read contact details from the Contact chunk stored in the vector DB."""
    text = "\n".join(
        doc.page_content
        for doc in get_all_documents()
        if CONTACT_SECTION in doc.metadata.get("section_title", "").lower()
    )

    info: dict[str, str] = {}

    for key, pattern in PATTERNS.items():
        match = re.search(pattern, text)
        if match:
            info[key] = match.group(0).strip().rstrip(".,)")

    return info


def clear_contact_cache() -> None:
    """Call after re-ingesting inside a long-running process."""
    get_contact_info.cache_clear()


def build_contact_answer(query: str) -> str:
    info = get_contact_info()

    if not info:
        return NOT_FOUND

    lowered = query.lower()

    requested = [
        key
        for key, words in KEYWORDS.items()
        if any(word in lowered for word in words)
    ]

    # Generic "how can I contact him" -> email + LinkedIn (per the KB rules)
    if not requested:
        requested = ["email", "linkedin"]

    lines = []
    missing = []

    for key in requested:
        if key in info:
            lines.append(f"{LABELS[key]}: {info[key]}")
        else:
            missing.append(LABELS[key])

    if not lines:
        return NOT_FOUND

    answer = "Here are Pourush's contact details:\n" + "\n".join(lines)

    if missing:
        answer += (
            f"\n\nI don't have his {', '.join(missing)} "
            "in the knowledge base."
        )

    return answer