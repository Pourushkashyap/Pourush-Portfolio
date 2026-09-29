import re

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# One-line numbered heading, e.g. "5. Project — Crime Scene Detection"
HEADING_PATTERN = re.compile(
    r"(?m)^(?P<number>\d{1,2})\.\s+(?P<title>[A-Z][^\n]*)$"
)

PROJECT_PATTERN = re.compile(r"^Project\s+—\s+(.+)$", re.IGNORECASE)

# A heading line ending with one of these words wraps onto the next line
CONTINUATION_WORDS = {"to", "and", "of", "for", "the", "a", "in", "&", "—", "-", "should"}

# Knowledge-base control sections that must never be retrieved
BLOCKED_PHRASES = [
    "high-value questions this knowledge base should answer",
    "recommended chunking strategy",
    "rag assistant — exact answering rules",
    "end of deep rag knowledge base",
]

ADDENDUM_MARKER = "Pourush Kashyap — Project Technology Stack"

ADDENDUM_PROJECTS = [
    "Crime Scene Detection",
    "SilentSOS",
    "FinGrow",
    "FitGenius AI",
    "CodePilot AI",
    "AgentForge",
    "Self-Healing Debugger",
    "Portfolio Website",
]



def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip()).lower()


def is_blocked(section_text: str) -> bool:
    """Check only the heading area of a section, never its whole body."""
    head = normalize(section_text[:250])
    return any(phrase in head for phrase in BLOCKED_PHRASES)


def clean_metadata(metadata: dict) -> dict:
    """Chroma does not accept None metadata values."""
    return {key: value for key, value in metadata.items() if value is not None}


def merge_pages(documents: list[Document]) -> tuple[str, list[tuple[int, int]]]:
    """Join all pages into one text; remember (start_offset, page_number)."""
    parts = []
    offsets = []
    cursor = 0

    for doc in documents:
        offsets.append((cursor, doc.metadata.get("page", 0)))
        parts.append(doc.page_content)
        cursor += len(doc.page_content) + 1  # +1 for the "\n" used in join

    return "\n".join(parts), offsets


def page_at(offset: int, offsets: list[tuple[int, int]]) -> int:
    page = offsets[0][1]

    for start, page_number in offsets:
        if start <= offset:
            page = page_number
        else:
            break

    return page


def find_headings(text: str) -> list[dict]:
    """
    Find numbered headings in strict sequence (1, 2, 3, ...).
    This avoids false positives from numbered lines inside section bodies.
    """
    headings = []
    expected = 1

    for match in HEADING_PATTERN.finditer(text):
        if int(match.group("number")) != expected:
            continue

        title = match.group("title").strip()
        end = match.end()

        # Handle headings that wrap onto a second line
        words = title.split()
        last_word = words[-1].lower() if words else ""

        if last_word in CONTINUATION_WORDS:
            next_line = re.match(r"\n([^\n]+)", text[end:])
            if next_line:
                title = f"{title} {next_line.group(1).strip()}"
                end += next_line.end()

        headings.append(
            {
                "start": match.start(),
                "body_start": end,
                "title": title,
                "number": expected,
            }
        )
        expected += 1

    return headings


def split_preamble(preamble: str) -> list[tuple[str, str]]:
    """
    Split the unnumbered first-page text into:
    - Overview
    - Source Corrections (contains the Solitair internship correction)
    """
    match = re.search(r"(?m)^Critical correction[^\n]*$", preamble)

    if not match:
        return [("Overview", preamble)]

    parts = []

    overview = preamble[:match.start()].strip()
    corrections = preamble[match.start():].strip()

    if overview:
        parts.append(("Overview", overview))
    if corrections:
        parts.append(("Source Corrections", corrections))

    return parts

def split_technology_addendum(
    addendum_text: str,
    source: str,
    page: int,
) -> list[Document]:
    """
    Split the Project Technology Stack addendum into one chunk per project.
    Each project receives project_name metadata so project-specific retrieval
    can find it directly.
    """
    sections: list[Document] = []

    project_pattern = re.compile(
    r"(?m)^(?:\d+\.\s*)?(" +
    "|".join(re.escape(project) for project in ADDENDUM_PROJECTS) +
    r")\s*$"
)

    matches = list(project_pattern.finditer(addendum_text))
    print("DEBUG ADDENDUM PROJECT MATCHES:", [m.group(1) for m in matches])

    for index, match in enumerate(matches):
        project_name = match.group(1).strip()

        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(addendum_text)

        content = addendum_text[start:end].strip()

        if not content:
            continue

        sections.append(
            Document(
                page_content=content,
                metadata=clean_metadata(
                    {
                        "source": source,
                        "page": page,
                        "section_title": "Project Technology Stack",
                        "section_type": "project_technology_stack",
                        "project_name": project_name,
                        "retrieval_allowed": True,
                        "chunk_index": index,
                    }
                ),
            )
        )

    return sections

def build_sections(documents: list[Document]) -> list[Document]:
    if not documents:
        return []

    text, offsets = merge_pages(documents)
    headings = find_headings(text)
    source = documents[0].metadata.get("source")

    sections: list[Document] = []

    first_start = headings[0]["start"] if headings else len(text)
    preamble = text[:first_start].strip()

    if preamble:
        for title, part_text in split_preamble(preamble):
            sections.append(
                Document(
                    page_content=part_text,
                    metadata=clean_metadata(
                        {
                            "source": source,
                            "page": offsets[0][1],
                            "section_title": title,
                            "section_type": "preamble",
                            "retrieval_allowed": True,
                        }
                    ),
                )
            )

    for i, heading in enumerate(headings):
        end = headings[i + 1]["start"] if i + 1 < len(headings) else len(text)
        section_text = text[heading["start"]:end].strip()

        # IMPORTANT:
        # The numbered Section 17 ends when the Technology Stack Addendum starts.
        addendum_position = section_text.rfind("PROJECT TECHNOLOGY STACK")
        print("DEBUG ADDENDUM IN SECTION:", "PROJECT TECHNOLOGY STACK" in section_text)
        if addendum_position != -1:
            # Everything before the addendum belongs to the numbered section.
            main_section_text = section_text[:addendum_position].strip()

            if main_section_text and not is_blocked(main_section_text):
                project_match = PROJECT_PATTERN.match(heading["title"])

                sections.append(
                    Document(
                        page_content=main_section_text,
                        metadata=clean_metadata(
                            {
                                "source": source,
                                "page": page_at(heading["start"], offsets),
                                "section_number": heading["number"],
                                "section_title": heading["title"],
                                "section_type": (
                                    "project" if project_match else "portfolio_section"
                                ),
                                "project_name": (
                                    project_match.group(1).strip()
                                    if project_match
                                    else None
                                ),
                                "retrieval_allowed": True,
                            }
                        ),
                    )
                )

            # Parse the technology-stack addendum separately.
            addendum_text = section_text[addendum_position:].strip()

            sections.extend(
                split_technology_addendum(
                    addendum_text=addendum_text,
                    source=source,
                    page=page_at(
                        heading["start"] + addendum_position,
                        offsets,
                    ),
                )
            )

            break

        if is_blocked(section_text):
            continue

        project_match = PROJECT_PATTERN.match(heading["title"])

        sections.append(
            Document(
                page_content=section_text,
                metadata=clean_metadata(
                    {
                        "source": source,
                        "page": page_at(heading["start"], offsets),
                        "section_number": heading["number"],
                        "section_title": heading["title"],
                        "section_type": (
                            "project" if project_match else "portfolio_section"
                        ),
                        "project_name": (
                            project_match.group(1).strip()
                            if project_match
                            else None
                        ),
                        "retrieval_allowed": True,
                    }
                ),
            )
        )

    return sections


def split_documents(documents: list[Document]) -> list[Document]:
    """
    PDF pages -> merged text -> numbered sections -> blocked sections removed
    -> recursive chunks -> section/project context on every chunk.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1800,
        chunk_overlap=250,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks: list[Document] = []

    for section in build_sections(documents):
        title = section.metadata.get("section_title")
        project = section.metadata.get("project_name")
        is_preamble = section.metadata.get("section_type") == "preamble"

        header_lines = []
        if title:
            header_lines.append(f"Section: {title}")
        if project:
            header_lines.append(f"Project: {project}")

        header = "\n".join(header_lines)

        for index, chunk in enumerate(splitter.split_documents([section])):
            chunk.metadata["chunk_index"] = index

            # Numbered sections start with their own heading, so only later
            # chunks need the header. Preamble parts have no heading at all.
            if header and (index > 0 or is_preamble):
                chunk.page_content = f"{header}\n\n{chunk.page_content}"

            chunks.append(chunk)

    return chunks