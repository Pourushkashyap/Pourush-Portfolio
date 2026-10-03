from app.graph.state import ChatState
from app.llm.model import llm
from app.rag.query_transformer import transform_query
from app.rag.retriever import retrieve_documents
from app.services.answerability_service import check_answerability
from app.services.contact_service import build_contact_answer
from app.services.not_found_service import build_not_found_answer
from app.services.pronouns import resolve_owner_pronouns
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


def resolved_query(state: ChatState) -> str:
    """The question with follow-up references resolved ("its future plans" -> project)."""
    return state.get("contextualized_query", state["query"])


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
    # Friendly "I don't know" + Pourush's email and phone
    return {"answer": build_not_found_answer(resolved_query(state))}


def contextualize(state: ChatState) -> dict:
    rewritten_query = contextualize_query(
        query=state["query"],
        messages=state.get("messages", []),
    )

    # "Does he know Python?" -> "Does Pourush know Python?"
    # (the reranker cannot match "he" to the name in the knowledge base)
    return {"contextualized_query": resolve_owner_pronouns(rewritten_query)}


def query_transform(state: ChatState) -> dict:
    query = resolved_query(state)
    result = transform_query(query)

    return {
        "original_query": query,
        "rewritten_query": result["rewritten_query"],
        "expanded_queries": result["expanded_queries"],
        "sub_queries": result["sub_queries"],
    }


def retrieve(state: ChatState) -> dict:
    original_query = resolved_query(state)

    documents = retrieve_documents(
        query=original_query,
        rewritten_query=state.get("rewritten_query", original_query),
        expanded_queries=state.get("expanded_queries", []),
        sub_queries=state.get("sub_queries", []),
        k=5,
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
        query=resolved_query(state),
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
        query=resolved_query(state),
        documents=state.get("documents", []),
        feedback=feedback,
    )

    return {
        "answer": answer,
        "attempts": attempts + 1,
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

    # The model correctly said it has no information: nothing to validate.
    # Replace the bare message with the friendly "I don't know" + contact details.
    if answer.strip() == NOT_FOUND_MESSAGE:
        return {
            "answer": build_not_found_answer(resolved_query(state)),
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
        query=resolved_query(state),
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