from app.rag.embeddings import get_embeddings


def main():
    embeddings = get_embeddings()

    text = "Pourush Kashyap is an AI and Agentic AI developer."

    vector = embeddings.embed_query(text)

    print("Embedding generated successfully.")
    print("Vector type:", type(vector))
    print("Vector dimensions:", len(vector))
    print("First 5 values:", vector[:5])


if __name__ == "__main__":
    main()