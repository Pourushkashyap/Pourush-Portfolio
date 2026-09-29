import re

from langchain_core.documents import Document


PROJECT_PATTERN = re.compile(
    r"^\d+\.\s+Project\s+—\s+(.+)$",
    re.MULTILINE,
)


def enrich_metadata(documents: list[Document]) -> list[Document]:
    enriched = []

    for document in documents:
        text = document.page_content

        metadata = dict(document.metadata)

        metadata["source_type"] = "portfolio_knowledge_base"

        # Detect project only if the project heading
        # actually exists inside this chunk.
        project_match = PROJECT_PATTERN.search(text)

        if project_match:
            metadata["project_name"] = project_match.group(1).strip()
        else:
            metadata["project_name"] = None

        metadata["retrieval_allowed"] = is_retrieval_allowed(text)

        metadata["section"] = detect_section(text)

        enriched.append(
            Document(
                page_content=text,
                metadata=metadata,
            )
        )

    return enriched


def is_retrieval_allowed(text: str) -> bool:

    blocked_patterns = [
        r"High-value questions this knowledge base should answer",
        r"Recommended chunking strategy",
        r"Exact Answering Rules",
        r"End of Deep RAG Knowledge Base",
    ]

    for pattern in blocked_patterns:

        if re.search(
            pattern,
            text,
            re.IGNORECASE,
        ):
            return False

    return True


def detect_section(text: str) -> str | None:

    section_patterns = {
        "problem_statement": r"Problem statement",
        "architecture": (
            r"(?:Architecture|System architecture|"
            r"Pipeline architecture|Multi-agent architecture)"
        ),
        "workflow": (
            r"(?:End-to-end approach|Core workflow|"
            r"Detailed workflow|Audio ML pipeline)"
        ),
        "implementation": r"Implementation details represented in the portfolio",
        "implementation_stack": r"Implementation stack",
        "future_roadmap": r"Future roadmap",
        "evaluation": r"Evaluation",
        "agents_components": r"Agents / components",
        "high_risk_policy": r"High-risk change policy",
        "current_state_boundary": r"Important current-state boundary",
    }

    for section_name, pattern in section_patterns.items():

        if re.search(
            pattern,
            text,
            re.IGNORECASE,
        ):
            return section_name

    return None