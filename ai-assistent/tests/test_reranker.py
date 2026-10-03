from langchain_core.documents import Document
from app.rag.reranker import rerank_documents


query = "How does SilentSOS process audio?"


documents = [
    Document(
        page_content="""
        SilentSOS is a mobile application designed for emergency
        situations and silent communication.
        """
    ),

    Document(
        page_content="""
        SilentSOS processes audio using FFmpeg preprocessing
        followed by librosa feature extraction. It extracts MFCC,
        pitch, zero-crossing rate and energy features, producing
        a 43-dimensional feature vector.
        """
    ),

    Document(
        page_content="""
        AgentForge is an AI agent builder that generates
        React and TypeScript applications.
        """
    ),

    Document(
        page_content="""
        FitGenius AI provides personalized diet and workout
        recommendations using machine learning.
        """
    ),
]


results = rerank_documents(
    query=query,
    documents=documents,
    top_k=3,
)


print("\n" + "=" * 80)
print("QUERY:", query)
print("=" * 80)

for i, doc in enumerate(results, start=1):

    print(f"\nRank {i}")
    print("-" * 80)

    print("Score:", doc.metadata.get("rerank_score"))

    print("Content:")
    print(doc.page_content.strip())