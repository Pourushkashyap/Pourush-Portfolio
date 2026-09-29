from app.rag.loader import load_pdf
from app.rag.splitter import split_documents
from app.rag.vectorstore import get_vectorstore


PDF_PATH = "data/Pourush_Kashyap_Complete_RAG_Knowledge_Base_With_Tech_Section_Corrected.pdf"


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

        print(
            "Page:",
            chunk.metadata.get("page"),
        )

        print(
            "Section:",
            chunk.metadata.get("section_title"),
        )

        print(
            "Project:",
            chunk.metadata.get("project_name"),
        )

        print(
            "Content:",
            chunk.page_content[:300],
        )

    print("\nCreating Gemini embeddings and storing in Chroma...")

    vectorstore = get_vectorstore()

    vectorstore.add_documents(chunks)

    print("\nIngestion completed successfully.")

    print("Vector store saved to: chroma_db/")


if __name__ == "__main__":
    main()