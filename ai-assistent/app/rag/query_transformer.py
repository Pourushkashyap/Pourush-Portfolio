import json
import re
from typing import Any

from langchain_core.prompts import ChatPromptTemplate

from app.llm.model import llm


QUERY_TRANSFORM_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a query transformation component for a generic RAG system.

Your job is ONLY to transform the user's question into better
retrieval queries.

You must NOT answer the question.

You must NOT invent facts.

You must NOT add project names, company names, technologies,
people, or other entities that are not present or clearly implied
by the user's question.

Return ONLY a JSON object (no code fences, no extra text) with exactly
these fields:

{{
    "rewritten_query": "one clear retrieval-friendly query",
    "expanded_queries": [
        "alternative retrieval query 1",
        "alternative retrieval query 2",
        "alternative retrieval query 3"
    ],
    "sub_queries": [
        "sub-question 1"
    ]
}}

Rules:

1. Preserve the original meaning.
2. Rewrite vague conversational language into explicit retrieval language.
3. Use synonyms when useful.
4. Do not invent facts.
5. If the question asks only one thing, keep sub_queries to one query.
6. If the question contains multiple independent information needs,
   split them into separate sub-questions.
7. Keep queries concise.
8. Do not answer the question.
""",
        ),
        (
            "human",
            "User query:\n{query}",
        ),
    ]
)


def parse_json_object(text: str) -> dict:
    """Gemini often wraps JSON in ```json fences; strip them and parse."""
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.MULTILINE).strip()
    start, end = text.find("{"), text.rfind("}")
    return json.loads(text[start:end + 1])


def _clean_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def transform_query(query: str) -> dict[str, Any]:
    """
    Transform a user query into retrieval-friendly queries.
    Never raises: on any LLM or parsing error it falls back to the original query.
    """
    query = query.strip()

    if not query:
        return {"rewritten_query": "", "expanded_queries": [], "sub_queries": []}

    fallback = {
        "rewritten_query": query,
        "expanded_queries": [],
        "sub_queries": [query],
    }

    try:
        response = (QUERY_TRANSFORM_PROMPT | llm).invoke({"query": query})
        content = response.content

        if isinstance(content, list):
            content = "".join(
                part.get("text", "") if isinstance(part, dict) else str(part)
                for part in content
            )

        data = parse_json_object(content)
    except Exception:
        return fallback

    rewritten_query = str(data.get("rewritten_query", "")).strip() or query
    expanded_queries = _clean_list(data.get("expanded_queries"))
    sub_queries = _clean_list(data.get("sub_queries")) or [rewritten_query]

    return {
        "rewritten_query": rewritten_query,
        "expanded_queries": expanded_queries[:3],
        "sub_queries": sub_queries[:3],
    }