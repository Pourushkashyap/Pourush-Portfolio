from app.rag.retriever import (
    build_retrieval_queries,
    get_semantic_documents,
    get_bm25_documents,
    reciprocal_rank_fusion,
)
from app.rag.reranker import rerank_documents


query = "What technologies does Pourush use?"

transformed = build_retrieval_queries(
    query=query,
    rewritten_query="Technologies used by Pourush",
    expanded_queries=[
        "List of technologies employed by Pourush",
        "Tech stack of Pourush",
        "Programming languages and frameworks used by Pourush",
    ],
    sub_queries=[
        "What technologies does Pourush use?"
    ],
)

print("\nTRANSFORMED QUERIES")
for q in transformed:
    print("-", q)


result_lists = []

for q in transformed:

    semantic = get_semantic_documents(q, k=15)
    bm25 = get_bm25_documents(q, k=15)

    result_lists.append(semantic)
    result_lists.append(bm25)


fused = reciprocal_rank_fusion(result_lists)

print("\n" + "=" * 100)
print("RRF RESULTS")
print("=" * 100)

for i, doc in enumerate(fused[:20], start=1):

    print(
        f"{i:2}. "
        f"page={doc.metadata.get('page')} | "
        f"section={doc.metadata.get('section_title')} | "
        f"project={doc.metadata.get('project')} "
    )


print("\n" + "=" * 100)
print("FLASHRANK RESULTS")
print("=" * 100)

reranked = rerank_documents(
    query="Technologies used by Pourush",
    documents=fused[:30],
    top_k=20,
)

for i, doc in enumerate(reranked, start=1):

    print(
        f"{i:2}. "
        f"score={doc.metadata.get('rerank_score')} | "
        f"page={doc.metadata.get('page')} | "
        f"section={doc.metadata.get('section_title')} | "
        f"project={doc.metadata.get('project')}"
    )