import re

from app.llm.model import llm
from app.graph.state import ChatState
from app.rag.retriever import compact, get_project_names, project_aliases


INTENT_PROMPT = """
You are an intent classifier for Pourush Kashyap's portfolio AI assistant.

Classify the user's query into EXACTLY ONE of these four labels:

casual
portfolio
contact
other

Definitions:

CASUAL:
General conversation that does not require information about Pourush.

Examples:
- Hi
- Hello
- How are you?
- Good morning
- Thanks

PORTFOLIO:
Questions about Pourush's portfolio, projects, education, skills,
experience, internship, achievements, DSA, technologies, learning,
career plans, or background.
Any question about one of these projects is PORTFOLIO: {projects}

Examples:
- What projects has Pourush built?
- Tell me about AgentForge.
- What did Pourush work on during his internship?
- What technologies does Pourush know?
- What is his CGPA?
- Does FinGrow support repayments?
- Does Pourush know Rust?

CONTACT:
Questions asking how to contact Pourush or requesting his contact
information or professional profile links.

Examples:
- How can I contact Pourush?
- What is his email?
- Give me his LinkedIn.
- Give me his GitHub.
- Give me his LeetCode profile.

OTHER:
Anything unrelated to casual conversation, Pourush's portfolio,
or contact information.

Examples:
- What is today's weather?
- Explain quantum computing.
- Write a Python sorting algorithm.
- Who is Elon Musk?

IMPORTANT RULES:

- Return ONLY ONE label.
- The label must be exactly one of:
  casual
  portfolio
  contact
  other

- Do not explain your answer.
- Do not answer the user's question.

User query:
{query}

Intent:
"""


# Ordered on purpose: deterministic matching (sets have random order)
VALID_INTENTS = ("casual", "portfolio", "contact", "other")

# Fast path for obvious small talk: saves one LLM call
CASUAL_PATTERN = re.compile(
    r"^\s*(hi+|hello+|hey+|hii+|yo|good\s+(morning|afternoon|evening)|"
    r"how\s+are\s+you|thanks?(\s+a\s+lot)?|thank\s+you|ok(ay)?|cool|bye|goodbye)"
    r"[\s!.?]*$",
    re.IGNORECASE,
)


def safe_project_names() -> list[str]:
    try:
        return get_project_names()
    except Exception:
        return []


def mentions_known_project(query: str, names: list[str]) -> bool:
    compact_query = compact(query)

    return any(
        alias in compact_query
        for name in names
        for alias in project_aliases(name)
    )


def classify_intent(state: ChatState) -> dict:
    query = state.get(
    "contextualized_query",
    state["query"],
)

    if CASUAL_PATTERN.match(query):
        return {"intent": "casual"}

    project_names = safe_project_names()

    # A question naming one of Pourush's projects is always a portfolio question
    if mentions_known_project(query, project_names):
        return {"intent": "portfolio"}
    
        # DSA / problem-solving questions are portfolio questions.
    # "LeetCode profile" remains a contact/profile-link query.
    
    coding_request_pattern = re.compile(
        r"\b("
        r"write|create|generate|implement|code|build"
        r")\b.*\b("
        r"python|javascript|typescript|java|c\+\+|code|"
        r"program|function|algorithm|script"
        r")\b",
        re.IGNORECASE,
    )

    if coding_request_pattern.search(query):
        return {"intent": "other"}
    
    
    dsa_pattern = re.compile(
        r"\b("
        r"leetcode|geeksforgeeks|coding\s*ninjas|"
        r"dsa|data\s+structures?|algorithms?|"
        r"problems?\s+(?:has|have|did)|"
        r"solved|questions?\s+(?:has|have|did)"
        r")\b",
        re.IGNORECASE,
    )

    profile_pattern = re.compile(
        r"\b(leetcode|github|linkedin)\s+profile\b",
        re.IGNORECASE,
    )

    if dsa_pattern.search(query) and not profile_pattern.search(query):
        return {"intent": "portfolio"}
    
    prompt = INTENT_PROMPT.format(
        query=query,
        projects=", ".join(project_names) or "(none loaded)",
    )

    try:
        response = llm.invoke(prompt)
        text = response.content.strip().lower().replace("`", "")
    except Exception:
        # If the classifier fails, treat it as a portfolio question.
        # The answerability gate still rejects off-topic questions.
        return {"intent": "portfolio"}

    if text in VALID_INTENTS:
        return {"intent": text}

    match = re.search(r"\b(casual|portfolio|contact|other)\b", text)

    if match:
        return {"intent": match.group(1)}

    return {"intent": "portfolio"}


def route_by_intent(state: ChatState) -> str:
    return state["intent"]