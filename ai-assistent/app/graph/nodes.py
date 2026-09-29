from app.graph.state import ChatState
from app.llm.model import llm
from app.rag.retriever import retrieve_documents
from app.services.answerability_service import check_answerability
from app.services.contact_service import build_contact_answer
from app.services.response_service import NOT_FOUND_MESSAGE, generate_answer
from app.services.validation_service import (
    validate_answer as validate_generated_answer,
)
from app.services.contextualizer import contextualize_query


MAX_ATTEMPTS = 2  # first answer + one corrected retry


CASUAL_PROMPT = """
You are the friendly assistant on Pourush Kashyap's portfolio website.
The visitor sent a casual message (greeting, thanks, small talk or goodbye).

Reply in 1-2 short, warm sentences.

Rules:
- Respond naturally to what they said ("thanks" -> you're welcome, "bye" -> goodbye).
- Only for greetings or "how are you", also mention that you can answer
  questions about Pourush's projects, skills, education, internship,
  achievements and contact details.
- Do not state any facts about Pourush.

Visitor message: {query}

Reply:
"""

CASUAL_FALLBACK = (
    "Hi! I'm Pourush's portfolio assistant. I can answer questions about "
    "his projects, skills, education, internship, achievements and contact details."
)


def casual_response(state: ChatState) -> dict:
    try:
        response = llm.invoke(CASUAL_PROMPT.format(query=state["query"]))
        answer = response.content.strip() or CASUAL_FALLBACK
    except Exception:
        answer = CASUAL_FALLBACK

    return {"answer": answer}


def contact_response(state: ChatState) -> dict:
    return {"answer": build_contact_answer(state["query"])}


def refusal_response(state: ChatState) -> dict:
    return {
        "answer": (
            "I can only answer questions related to Pourush's "
            "portfolio, projects, skills, education, experience, "
            "achievements, and contact information."
        )
    }


def not_found_response(state: ChatState) -> dict:
    return {"answer": NOT_FOUND_MESSAGE}


def retrieve(state: ChatState) -> dict:
    query = state.get(
        "contextualized_query",
        state["query"],
    )

    documents = retrieve_documents(
        query=query,
        k=5,
        use_expansion=True,
    )

    return {"documents": documents}


def answerability(state: ChatState) -> dict:
    documents = state.get("documents", [])

    if not documents:
        return {
            "is_answerable": False,
            "answerability_reason": "No relevant knowledge-base documents were retrieved.",
        }

    result = check_answerability(
        query=state["query"],
        documents=documents,
    )

    return {
        "is_answerable": result["answerable"],
        "answerability_reason": result["reason"],
    }


def generate(state: ChatState) -> dict:
    attempts = state.get("attempts", 0)

    feedback = None

    # Retry: tell the model which claims the validator rejected
    if attempts > 0:
        claims = state.get("unsupported_claims") or []
        reason = state.get("validation_reason", "")

        parts = []
        if reason:
            parts.append(f"Fact-checker reason: {reason}")
        if claims:
            parts.append(
                "Unsupported claims to remove:\n"
                + "\n".join(f"- {claim}" for claim in claims)
            )

        feedback = "\n".join(parts) or None

    answer = generate_answer(
        query=state["query"],
        documents=state.get("documents", []),
        feedback=feedback,
    )

    return {
        "answer": answer,
        "attempts": attempts + 1,
    }

def contextualize(state: ChatState) -> dict:
    query = state["query"]
    messages = state.get("messages", [])

    rewritten_query = contextualize_query(
        query=query,
        messages=messages,
    )

    return {
        "contextualized_query": rewritten_query
    }


def validate(state: ChatState) -> dict:
    answer = state.get("answer", "")
    documents = state.get("documents", [])

    if not answer:
        return {
            "is_grounded": False,
            "validation_reason": "Generated answer is empty.",
            "unsupported_claims": [],
        }

    # The model correctly said it has no information: nothing to validate
    if answer.strip() == NOT_FOUND_MESSAGE:
        return {
            "is_grounded": True,
            "validation_reason": "Answer is the standard not-found message.",
            "unsupported_claims": [],
        }

    if not documents:
        return {
            "is_grounded": False,
            "validation_reason": "No supporting documents were retrieved.",
            "unsupported_claims": [],
        }

    result = validate_generated_answer(
        query=state["query"],
        answer=answer,
        documents=documents,
    )

    return {
        "is_grounded": result["grounded"],
        "validation_reason": result["reason"],
        "unsupported_claims": result["unsupported_claims"],
    }


def route_after_answerability(state: ChatState) -> str:
    return "generate" if state.get("is_answerable") else "not_found"


def route_after_validate(state: ChatState) -> str:
    if state.get("is_grounded"):
        return "done"

    if state.get("attempts", 1) < MAX_ATTEMPTS:
        return "retry"

    return "not_found"