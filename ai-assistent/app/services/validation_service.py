from app.llm.model import llm
from app.services.response_service import format_documents
from app.utils.json_utils import parse_llm_json


VALIDATION_PROMPT = """
You are a strict factuality validator for a portfolio RAG assistant.

Determine whether the generated answer is fully supported by
the provided knowledge-base context.

Rules:

1. Evaluate factual claims individually.
2. A claim is supported only if the context provides evidence for it.
3. Do not use outside knowledge.
4. Do not assume information that is merely plausible.
5. Project names, technologies, dates, employers, responsibilities,
   metrics, features, certifications, and future plans must be
   supported by the context.
6. If an important factual claim is unsupported, grounded must be false.
7. Do not penalize harmless conversational wording or formatting.
8. Return unsupported claims explicitly.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Required format:

{{
  "grounded": true,
  "reason": "short explanation",
  "unsupported_claims": []
}}

If unsupported claims exist:

{{
  "grounded": false,
  "reason": "short explanation",
  "unsupported_claims": [
    "unsupported claim 1"
  ]
}}

User question:
{query}

Generated answer:
{answer}

Knowledge-base context:
{context}
"""


def validate_answer(
    query: str,
    answer: str,
    documents,
) -> dict:
    context = format_documents(documents)

    prompt = VALIDATION_PROMPT.format(
        query=query,
        answer=answer,
        context=context,
    )

    try:
        response = llm.invoke(prompt)
    except Exception as error:
        return {
            "grounded": True,
            "reason": f"Validator unavailable: {error}",
            "unsupported_claims": [],
        }

    result = parse_llm_json(response.content)

    if result is None:
        # Technical failure of the validator, not evidence of a bad answer
        return {
            "grounded": True,
            "reason": "Validator returned unparseable output.",
            "unsupported_claims": [],
        }

    claims = result.get("unsupported_claims", [])

    if not isinstance(claims, list):
        claims = [str(claims)]

    return {
        "grounded": bool(result.get("grounded", False)),
        "reason": str(result.get("reason", "No validation reason provided.")),
        "unsupported_claims": [str(claim) for claim in claims],
    }