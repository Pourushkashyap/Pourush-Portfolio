from app.llm.model import llm


QUERY_EXPANSION_PROMPT = """
You are a search-query expansion component for a portfolio knowledge-base RAG system.

Your job is to rewrite the user's question into 3 short search queries
that are useful for retrieving factual information from the portfolio knowledge base.

Rules:
- Do not answer the question.
- Do not invent facts.
- Preserve names, organizations, projects, technologies and important terms.
- Make each query semantically different.
- Focus on terms likely to appear in the knowledge base.
- Return ONLY the queries, one per line.
- Do not number them.

User question:
{query}
"""


def expand_query(query: str) -> list[str]:
    prompt = QUERY_EXPANSION_PROMPT.format(
        query=query
    )

    response = llm.invoke(prompt)

    content = response.content.strip()

    queries = [
        line.strip()
        for line in content.splitlines()
        if line.strip()
    ]

    return queries[:3]