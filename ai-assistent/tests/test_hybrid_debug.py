from app.rag.query_transformer import transform_query
from app.rag.retriever import (
    get_semantic_documents,
    get_bm25_documents,
    reciprocal_rank_fusion,
)


query = "What technologies does Pourush use?"

result = transform_query(query)

queries = [
    query,
    result["rewritten_query"],
    *result["expanded_queries"],
    *result["sub_queries"],
]


# Remove duplicates
unique_queries = []

for q in queries:
    if q and q.lower() not in {
        x.lower() for x in unique_queries
    }:
        unique_queries.append(q)


print("\n" + "=" * 100)
print("TRANSFORMED QUERIES")
print("=" * 100)

for i, q in enumerate(unique_queries, 1):
    print(f"{i}. {q}")


result_lists = []


for q in unique_queries:

    print("\n" + "=" * 100)
    print("QUERY:", q)
    print("=" * 100)

    semantic_docs = get_semantic_documents(
        q,
        k=15,
    )

    bm25_docs = get_bm25_documents(
        q,
        k=15,
    )

    print("\n--- SEMANTIC ---")

    for i, doc in enumerate(
        semantic_docs,
        1,
    ):
        print(
            f"{i}. "
            f"page={doc.metadata.get('page')} | "
            f"section={doc.metadata.get('section_title')} | "
            f"project={doc.metadata.get('project_name')} | "
            f"text={doc.page_content[:180].replace(chr(10), ' ')}"
        )

    print("\n--- BM25 ---")

    for i, doc in enumerate(
        bm25_docs,
        1,
    ):
        print(
            f"{i}. "
            f"page={doc.metadata.get('page')} | "
            f"section={doc.metadata.get('section_title')} | "
            f"project={doc.metadata.get('project_name')} | "
            f"text={doc.page_content[:180].replace(chr(10), ' ')}"
        )

    result_lists.append(semantic_docs)
    result_lists.append(bm25_docs)


print("\n" + "=" * 100)
print("RRF RESULT")
print("=" * 100)

fused = reciprocal_rank_fusion(
    result_lists
)

for i, doc in enumerate(
    fused[:20],
    1,
):
    print(
        f"{i}. "
        f"page={doc.metadata.get('page')} | "
        f"section={doc.metadata.get('section_title')} | "
        f"project={doc.metadata.get('project_name')} | "
        f"text={doc.page_content[:220].replace(chr(10), ' ')}"
    )