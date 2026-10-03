from app.llm.model import llm


CONTEXTUALIZE_PROMPT = """
You are a query contextualization component for Pourush Kashyap's
portfolio AI assistant.

Rewrite the user's latest question so that it is understandable
without the conversation history.

Rules:

1. Use the conversation history only to resolve references such as:
   "it", "this project", "that", "he", "his", "they", etc.

2. Preserve the user's original meaning.

3. Do not answer the question.

4. Do not add facts that are not present in the conversation.

5. If the latest query is already self-contained, return it unchanged.

6. Keep the rewritten query concise.

7. Return ONLY the rewritten query.
   Do not add explanations, quotes, or labels.

Conversation history:
{history}

Latest user query:
{query}

Rewritten query:
"""


def contextualize_query(
    query: str,
    messages: list,
) -> str:

    if not messages:
        return query

    history_parts = []

    for message in messages:
        role = getattr(message, "type", "unknown")
        content = getattr(message, "content", "")

        if not content:
            continue

        if role == "human":
            role_name = "User"
        elif role == "ai":
            role_name = "Assistant"
        else:
            role_name = role.capitalize()

        history_parts.append(
            f"{role_name}: {content}"
        )

    if not history_parts:
        return query

    history = "\n".join(history_parts)

    prompt = CONTEXTUALIZE_PROMPT.format(
        history=history,
        query=query,
    )

    try:
        response = llm.invoke(prompt)

        rewritten = response.content.strip()

        if rewritten:
            print("\n" + "=" * 60)
            print("ORIGINAL QUERY:")
            print(query)

            print("\nREWRITTEN QUERY:")
            print(rewritten)

            print("=" * 60)
            return rewritten

    except Exception:
        pass

    # Safe fallback:
    # if contextualization fails, use the original query.
    return query