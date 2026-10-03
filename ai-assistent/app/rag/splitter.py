"""
Structure-aware splitter. Works from the heading markers produced by
loader.py, so it does not depend on heading numbers or fixed heading names.

    Section heading   "Project: AgentForge"   -> project_name = AgentForge
                      "Internship: Acme"      -> entity_type=internship
                      "Education"             -> plain section
    Sub-heading       any text ("Future improvements", "Challenges", ...)

Every chunk starts with a header naming its project/section and topic, so it
makes sense on its own when retrieved.
"""

import re
from collections import Counter

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.rag.loader import SECTION_MARK, SUBSECTION_MARK, TITLE_MARK

SECTION_PATTERN = re.compile(r"(?m)^" + re.escape(SECTION_MARK) + r" (?P<title>.+)$")
SUBSECTION_PATTERN = re.compile(r"(?m)^" + re.escape(SUBSECTION_MARK) + r" (?P<title>.+)$")

NUMBERING = re.compile(r"^\d{1,2}[.)]\s+")
ENTITY_PATTERN = re.compile(r"^(?P<kind>[A-Za-z][\w &/]{0,30}?)\s*[:\-–—]\s+(?P<name>.+)$")
PROJECT_KINDS = {"project"}

CHUNK_SIZE = 1200
CHUNK_OVERLAP = 150


def clean_metadata(metadata: dict) -> dict:
    return {key: value for key, value in metadata.items() if value is not None}


def _page_separator(previous_text: str) -> str:
    """Join with a space only when a paragraph continues on the next page."""
    last = previous_text.rstrip().split("\n\n")[-1]

    if last.startswith("[[") or last.endswith((".", "!", "?", ":")):
        return "\n\n"

    return " "


def merge_pages(documents: list[Document]) -> tuple[str, list[tuple[int, int]]]:
    parts: list[str] = []
    offsets: list[tuple[int, int]] = []
    cursor = 0
    previous = ""

    for doc in documents:
        if parts:
            separator = _page_separator(previous)
            parts.append(separator)
            cursor += len(separator)

        offsets.append((cursor, doc.metadata.get("page", 0)))
        parts.append(doc.page_content)
        cursor += len(doc.page_content)
        previous = doc.page_content

    return "".join(parts), offsets


def page_at(offset: int, offsets: list[tuple[int, int]]) -> int:
    page = offsets[0][1]

    for start, page_number in offsets:
        if start <= offset:
            page = page_number
        else:
            break

    return page


def parse_title(raw_title: str) -> dict:
    title = NUMBERING.sub("", raw_title.strip())
    match = ENTITY_PATTERN.match(title)

    kind = name = None
    if match:
        kind = match.group("kind").strip().lower()
        name = match.group("name").strip()

    return {
        "title": title,
        "entity_type": kind,
        "entity_name": name,
        "project": name if kind in PROJECT_KINDS else None,
    }


def normalize_subsection(title: str, entity_name: str | None) -> str:
    """'How AgentForge works' -> 'How it works' (name is already in the header)."""
    title = title.strip()

    if entity_name:
        title = re.sub(re.escape(entity_name), "it", title, flags=re.IGNORECASE)

    return title


def split_subsections(
    section_text: str,
    body_start: int,
    entity_name: str | None,
) -> list[tuple[str | None, str, int]]:
    body = section_text[body_start:]
    matches = list(SUBSECTION_PATTERN.finditer(body))

    if not matches:
        return [(None, body.strip(), body_start)]

    parts: list[tuple[str | None, str, int]] = []

    intro = body[: matches[0].start()].strip()
    if intro:
        parts.append(("Overview", intro, body_start))

    for i, match in enumerate(matches):
        stop = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        content = body[match.end():stop].strip()

        if content:
            parts.append(
                (
                    normalize_subsection(match.group("title"), entity_name),
                    content,
                    body_start + match.start(),
                )
            )

    return parts


def build_header(title: str, project: str | None, subsection: str | None) -> str:
    lines = [f"Project: {project}" if project else f"Section: {title}"]

    if subsection:
        lines.append(f"Topic: {subsection}")

    return "\n".join(lines)


def report(chunks: list[Document]) -> None:
    """Printed on every ingest so structure problems are visible immediately."""
    projects = list(
        dict.fromkeys(
            c.metadata["project_name"] for c in chunks if c.metadata.get("project_name")
        )
    )
    sections = list(
        dict.fromkeys(
            c.metadata["section_title"]
            for c in chunks
            if c.metadata.get("section_type") != "preamble"
        )
    )
    types = Counter(c.metadata.get("section_type") for c in chunks)

    print(f"Structure: {len(chunks)} chunks, {len(sections)} sections, {len(projects)} projects")
    print(f"  Chunk types: {dict(types)}")
    print(f"  Projects:    {projects}")
    print(f"  Sections:    {sections}")

    oversized = [c for c in chunks if len(c.page_content) > CHUNK_SIZE * 1.3]
    if oversized:
        print(f"  WARNING: {len(oversized)} oversized chunks")
    if not projects:
        print("  WARNING: no 'Project: Name' sections found")


def split_documents(documents: list[Document]) -> list[Document]:
    if not documents:
        return []

    text, offsets = merge_pages(documents)
    source = documents[0].metadata.get("source")
    sections = list(SECTION_PATTERN.finditer(text))

    if not sections:
        raise ValueError(
            "No section headings found. Section headings must be bold and "
            "larger than body text (see the PDF format guide)."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", ". ", " ", ""],
    )

    def make_chunks(body, header, metadata, start_index):
        return [
            Document(
                page_content=f"{header}\n\n{piece}",
                metadata=clean_metadata({**metadata, "chunk_index": start_index + i}),
            )
            for i, piece in enumerate(splitter.split_text(body))
        ]

    chunks: list[Document] = []

    # Title block before the first section
    preamble = text[: sections[0].start()].replace(TITLE_MARK + " ", "").strip()

    if preamble:
        chunks.extend(
            make_chunks(
                preamble,
                "Section: Overview",
                {
                    "source": source,
                    "page": offsets[0][1],
                    "section_title": "Overview",
                    "section_type": "preamble",
                    "retrieval_allowed": True,
                },
                0,
            )
        )

    for number, match in enumerate(sections, start=1):
        end = sections[number].start() if number < len(sections) else len(text)
        section_text = text[match.start():end]
        info = parse_title(match.group("title"))

        base = {
            "source": source,
            "section_number": number,
            "section_title": info["title"],
            "section_type": "project" if info["project"] else "portfolio_section",
            "project_name": info["project"],
            "entity_type": info["entity_type"],
            "entity_name": info["entity_name"],
            "retrieval_allowed": True,
        }

        section_chunks: list[Document] = []

        for subsection, body, offset in split_subsections(
            section_text,
            match.end() - match.start(),
            info["entity_name"],
        ):
            section_chunks.extend(
                make_chunks(
                    body,
                    build_header(info["title"], info["project"], subsection),
                    {
                        **base,
                        "page": page_at(match.start() + offset, offsets),
                        "subsection": subsection,
                    },
                    len(section_chunks),
                )
            )

        chunks.extend(section_chunks)

    report(chunks)
    return chunks