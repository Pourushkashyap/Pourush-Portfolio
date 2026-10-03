"""
Replace "he / his / him" with the portfolio owner's name.

This assistant only talks about one person, so those words always mean him.
It matters because the cross-encoder reranker cannot connect "he" to the name
in the text: "Does he know Python?" scored the skills chunk 0.001, while
"Does Pourush know Python?" scored it 0.991, so the right chunk was dropped
and the visitor got a "not found" reply.
"""

import re

# Change this if the portfolio belongs to someone else.
OWNER_NAME = "Pourush"

_POSSESSIVE = re.compile(r"\bhis\b", re.IGNORECASE)
_SUBJECT_OR_OBJECT = re.compile(r"\b(?:he|him)\b", re.IGNORECASE)


def resolve_owner_pronouns(query: str) -> str:
    query = _POSSESSIVE.sub(f"{OWNER_NAME}'s", query)
    query = _SUBJECT_OR_OBJECT.sub(OWNER_NAME, query)
    return query