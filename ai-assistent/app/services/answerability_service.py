from app.llm.model import llm
from app.services.response_service import format_documents
from app.utils.json_utils import parse_llm_json


ANSWERABILITY_PROMPT = """
You are an answerability checker for a portfolio RAG system.

Determine whether the retrieved knowledge-base context contains
enough information to answer the user's question.

Rules:

1. Use ONLY the provided context.
2. Do not use outside knowledge.
3. Do not assume that a vaguely related document provides an answer.
4. The answer must be directly supported by the retrieved context.
5. If the question asks about a technology, project, employer,
   responsibility, metric, date, certification, or experience that
   is not explicitly supported, mark it as not answerable.
6. If the context contains enough evidence, mark it answerable.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Required format:

{{
  "answerable": true,
  "reason": "short explanation"
}}

OR:

{{
  "answerable": false,
  "reason": "short explanation"
}}

User question:
{query}

Retrieved context:
{context}
"""


def check_answerability(
    query: str,
    documents,
) -> dict:
    context = format_documents(documents)

    prompt = ANSWERABILITY_PROMPT.format(
        query=query,
        context=context,
    )

    try:
        response = llm.invoke(prompt)
    except Exception as error:
        # Technical failure: let generation + validation decide
        return {
            "answerable": True,
            "reason": f"Answerability check unavailable: {error}",
        }

    result = parse_llm_json(response.content)

    if result is None:
        # Unparseable reply: fail open, the validator still protects the answer
        return {
            "answerable": True,
            "reason": "Answerability checker returned unparseable output.",
        }

    return {
        "answerable": bool(result.get("answerable", False)),
        "reason": str(result.get("reason", "No answerability reason provided.")),
    }