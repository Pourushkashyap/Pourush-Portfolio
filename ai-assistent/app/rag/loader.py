from pathlib import Path
import re

import pymupdf
from langchain_core.documents import Document


def load_pdf(file_path: str) -> list[Document]:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {path}")

    pdf = pymupdf.open(path)
    documents = []

    for page_number, page in enumerate(pdf):
        text = page.get_text("text").strip()

        if not text:
            continue

        # Remove the repeated header together with its "Page N" suffix
        text = re.sub(
            r"Pourush Kashyap — Deep RAG Knowledge Base\s*(?:Page\s+\d+)?\s*",
            "",
            text,
        )

        # Remove any leftover standalone "Page N" line
        text = re.sub(r"(?m)^Page\s+\d+\s*$", "", text)

        text = text.strip()

        if not text:
            continue

        documents.append(
            Document(
                page_content=text,
                metadata={
                    "source": path.name,
                    "page": page_number + 1,
                },
            )
        )

    pdf.close()
    return documents