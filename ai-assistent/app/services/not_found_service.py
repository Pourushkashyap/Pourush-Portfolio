"""
Friendly answer for questions the knowledge base cannot answer.

Instead of the bare "I don't have that information", the visitor gets a clear
reply plus Pourush's email and phone, read from the knowledge base (the same
source the contact answers use), so a recruiter always has a next step.

NOT_FOUND_MESSAGE stays the internal signal ("the model found nothing");
this module turns it into the text the visitor sees.
"""

import re

from app.services.contact_service import get_contact_info
from app.services.response_service import NOT_FOUND_MESSAGE

# Salary, notice period, relocation...: never in a portfolio, best asked directly.
PRIVATE_TOPIC = re.compile(
    r"\b(salary|salaries|ctc|compensation|stipend|package|pay\s+expectations?|"
    r"expected\s+pay|notice\s+period|relocat\w*|joining\s+date|start\s+date|"
    r"when\s+can\s+he\s+join|visa|work\s+permit)\b",
    re.IGNORECASE,
)

# "Does he know Rust?", "Has he worked with Kubernetes?"
SKILL_CHECK = re.compile(
    r"\b(know|knows|knowledge|familiar|familiarity|experience|experienced|"
    r"worked\s+with|work\s+with|use|uses|used|proficient|skilled|expert)\b",
    re.IGNORECASE,
)

GENERIC_MESSAGE = "I don't have that information in Pourush's portfolio."

SKILL_MESSAGE = (
    "That isn't listed among Pourush's skills, projects or experience in his "
    "portfolio, so I can't confirm it."
)

PRIVATE_MESSAGE = (
    "That isn't shared in Pourush's portfolio, so it's best discussed with "
    "him directly."
)

CONTACT_INTRO = "You can connect with him directly:"


def is_not_found(answer: str) -> bool:
    return answer.strip() == NOT_FOUND_MESSAGE


def build_not_found_answer(query: str) -> str:
    if PRIVATE_TOPIC.search(query):
        message = PRIVATE_MESSAGE
    elif SKILL_CHECK.search(query):
        message = SKILL_MESSAGE
    else:
        message = GENERIC_MESSAGE

    try:
        info = get_contact_info()
    except Exception:
        info = {}

    lines = []

    if info.get("email"):
        lines.append(f"Email: {info['email']}")
    if info.get("phone"):
        lines.append(f"Phone: {info['phone']}")

    # No contact details in the knowledge base: still give a clean answer.
    if not lines:
        return message

    return f"{message}\n\n{CONTACT_INTRO}\n" + "\n".join(lines)