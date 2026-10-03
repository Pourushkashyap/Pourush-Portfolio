"""
PDF loader that understands document structure from FONT STYLE, not from
hard-coded heading text. Any PDF that follows the layout rules works:

    Title            -> largest bold text, appears once at the top
    Section heading  -> bold, next size down      (e.g. "Project: AgentForge")
    Sub-heading      -> bold, smaller than a section heading
    Body text        -> normal weight, the most common font size

Text that repeats on most pages (headers, footers, page numbers) is removed
automatically.
"""

import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

import pymupdf
from langchain_core.documents import Document

TITLE_MARK = "[[T]]"
SECTION_MARK = "[[H1]]"
SUBSECTION_MARK = "[[H2]]"

PAGE_NUMBER = re.compile(r"^(page\s+)?\d+(\s*(of|/)\s*\d+)?$", re.IGNORECASE)
MIN_HEADING_BOOST = 1.0        # heading must be at least this much larger than body
REPEAT_RATIO = 0.6             # "furniture" = appears on >= 60% of pages
WRAPPED_HEADING_MIN_CHARS = 55
LINE_Y_TOLERANCE = 1.5         # chars within this baseline distance = same line


@dataclass
class Line:
    text: str
    size: float
    bold: bool
    block: int


def extract_lines(page) -> list[Line]:
    """
    pymupdf adapter: one Line per VISUAL line, with font size and weight.

    Lines are rebuilt from character positions (baseline y) instead of
    trusting pymupdf's own line grouping, which can merge two wrapped lines
    into one and glue words together ("Engineering" + "student").
    """
    lines: list[Line] = []

    for block_no, block in enumerate(page.get_text("rawdict", sort=True)["blocks"]):
        if block.get("type") != 0:
            continue

        chars: list[str] = []
        size = 0.0
        bold = True
        baseline = None

        def emit() -> None:
            text = " ".join("".join(chars).split())
            if text:
                lines.append(Line(text, round(size, 1), bold and size > 0, block_no))

        for pdf_line in block["lines"]:
            for span in pdf_line["spans"]:
                span_bold = bool(span["flags"] & 16) or "bold" in span["font"].lower()

                for char in span["chars"]:
                    y = char["origin"][1]

                    if baseline is None or abs(y - baseline) > LINE_Y_TOLERANCE:
                        emit()
                        chars, size, bold, baseline = [], 0.0, True, y

                    chars.append(char["c"])

                    if char["c"].strip():
                        size = max(size, span["size"])
                        bold = bold and span_bold

        emit()

    return lines


def _body_size(pages: list[list[Line]]) -> float:
    weight: Counter = Counter()

    for lines in pages:
        for line in lines:
            weight[line.size] += len(line.text)

    return weight.most_common(1)[0][0] if weight else 10.0


def _is_heading_candidate(line: Line, body: float) -> bool:
    return line.bold and line.size >= body + MIN_HEADING_BOOST


def _strip_page_furniture(pages: list[list[Line]], body: float) -> list[list[Line]]:
    """Remove page numbers and any text repeated on most pages (header/footer)."""
    total = len(pages)
    counts: Counter = Counter()

    def key(line: Line) -> str:
        return re.sub(r"\d+", "#", line.text.lower())

    for lines in pages:
        counts.update({key(line) for line in lines})

    def is_furniture(line: Line) -> bool:
        if _is_heading_candidate(line, body):
            return False  # repeated sub-headings ("Future improvements") are real
        if PAGE_NUMBER.match(line.text):
            return True
        return total >= 3 and counts[key(line)] >= max(3, total * REPEAT_RATIO)

    return [[line for line in lines if not is_furniture(line)] for lines in pages]


def _heading_levels(pages: list[list[Line]], body: float) -> dict[float, int]:
    """
    Map heading font size -> level (0 title, 1 section, 2 sub-section).
    Ranked by size, so it works with any font sizes.
    """
    candidates = [
        line for lines in pages for line in lines if _is_heading_candidate(line, body)
    ]

    if not candidates:
        return {}

    sizes = sorted({line.size for line in candidates}, reverse=True)
    occurrences = Counter(line.size for line in candidates)

    levels: dict[float, int] = {}

    first = candidates[0]
    if len(sizes) >= 2 and first.size == sizes[0] and occurrences[sizes[0]] == 1:
        levels[sizes[0]] = 0
        sizes = sizes[1:]

    for rank, size in enumerate(sizes):
        levels[size] = 1 if rank == 0 else 2

    return levels


def build_documents(pages: list[list[Line]], source: str) -> list[Document]:
    """Pure function (no pymupdf): lines per page -> marked-up text per page."""
    if not pages:
        return []

    body = _body_size(pages)
    pages = _strip_page_furniture(pages, body)
    levels = _heading_levels(pages, body)
    marks = {0: TITLE_MARK, 1: SECTION_MARK, 2: SUBSECTION_MARK}

    documents: list[Document] = []

    for page_number, lines in enumerate(pages, start=1):
        blocks: list[str] = []
        paragraph: list[str] = []
        paragraph_block = None
        previous_heading: Line | None = None

        def flush() -> None:
            if paragraph:
                blocks.append(" ".join(paragraph))
                paragraph.clear()

        for line in lines:
            level = levels.get(line.size) if _is_heading_candidate(line, body) else None

            if level is not None:
                flush()

                wrapped = (
                    previous_heading is not None
                    and blocks
                    and blocks[-1].startswith(marks[level])
                    and previous_heading.size == line.size
                    and previous_heading.block == line.block
                    and len(previous_heading.text) >= WRAPPED_HEADING_MIN_CHARS
                )

                if wrapped:
                    blocks[-1] += " " + line.text
                else:
                    blocks.append(f"{marks[level]} {line.text}")

                previous_heading = line
                paragraph_block = None
                continue

            previous_heading = None

            if paragraph and line.block != paragraph_block:
                flush()

            paragraph.append(line.text)
            paragraph_block = line.block

        flush()

        text = "\n\n".join(blocks).strip()

        if text:
            documents.append(
                Document(
                    page_content=text,
                    metadata={"source": source, "page": page_number},
                )
            )

    return documents


def load_pdf(file_path: str) -> list[Document]:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {path}")

    pdf = pymupdf.open(path)

    try:
        pages = [extract_lines(page) for page in pdf]
    finally:
        pdf.close()

    return build_documents(pages, source=path.name)