from pathlib import Path

from app.rag.loader import load_pdf
from app.rag.splitter import split_documents
from app.rag.embeddings import get_embeddings
from langchain_community.vectorstores import FAISS


PDF_PATH = "data/Pourush_Kashyap_Profile.pdf"
FAISS_DIR = Path("vector_store")


def main():

    print("Loading PDF...")

    documents = load_pdf(PDF_PATH)

    print(f"Loaded documents: {len(documents)}")

    print("Structure-aware splitting...")

    chunks = split_documents(documents)

    print(f"Created retrieval chunks: {len(chunks)}")

    print("\nSample metadata:")

    for chunk in chunks[:5]:

        print("-" * 80)

        print("Page:", chunk.metadata.get("page"))

        print("Section:", chunk.metadata.get("section_title"))

        print("Project:", chunk.metadata.get("project_name"))

        print("Content:", chunk.page_content[:300])

    print("\nCreating Gemini embeddings...")

    embeddings = get_embeddings()

    print("Creating FAISS index...")

    vectorstore = FAISS.from_documents(
        chunks,
        embeddings,
    )

    FAISS_DIR.mkdir(parents=True, exist_ok=True)

    vectorstore.save_local(str(FAISS_DIR))

    print("\nIngestion completed successfully.")

    print(f"FAISS index saved to: {FAISS_DIR}/")


if __name__ == "__main__":
    main()