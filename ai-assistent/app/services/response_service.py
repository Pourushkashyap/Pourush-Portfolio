from langchain_core.documents import Document

from app.llm.model import llm

NOT_FOUND_MESSAGE = (
    "I don't have that information in Pourush's portfolio/project knowledge base."
)


SYSTEM_PROMPT = """
You are Pourush Kashyap's portfolio AI assistant.

Answer the user's question ONLY using the provided portfolio
knowledge-base context.

Rules:

1. Do not invent information.
2. Do not use outside knowledge.
3. Do not assume facts that are not present in the context.
4. If the context does not contain enough information, say exactly:

"I don't have that information in Pourush's portfolio/project knowledge base."

5. Preserve the terminology used in the knowledge base.
6. Do not claim technologies, metrics, dates, responsibilities,
   employers, certifications, or features unless supported by the context.
7. Clearly distinguish current work from future plans.
8. Keep the answer concise but useful.
9. For the Solitair Infosys internship, the project is Crime Scene Detection.
10. If sources conflict (for example DSA problem counts), state both
    values and name the source of each instead of merging them.
11. Do not claim that every listed skill is used in every project.
12. Do not add descriptive words such as real-time, production-ready,
    scalable, high-accuracy, or state-of-the-art unless the context
    uses those exact words. Use the context's own wording
    (for example "dynamic predictions").
13. If the question asks for a list of projects, include EVERY project
    that appears in the context, each with one short line.

Knowledge-base context:

{context}

User question:

{query}
{revision_note}
"""


def format_documents(documents: list[Document]) -> str:
    if not documents:
        return ""

    formatted = []

    for i, doc in enumerate(documents, start=1):
        formatted.append(
            f"""
--- Context {i} ---
{doc.page_content}
"""
        )

    return "\n".join(formatted)


def generate_answer(
    query: str,
    documents: list[Document],
    feedback: str | None = None,
) -> str:
    context = format_documents(documents)

    revision_note = ""

    if feedback:
        revision_note = (
            "\nIMPORTANT: A previous draft was rejected by a fact-checker.\n"
            f"{feedback}\n"
            "Write a new answer that contains only facts stated in the context."
        )

    prompt = SYSTEM_PROMPT.format(
        context=context,
        query=query,
        revision_note=revision_note,
    )

    response = llm.invoke(prompt)

    return response.content.strip()