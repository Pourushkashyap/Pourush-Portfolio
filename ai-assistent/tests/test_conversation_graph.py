from langchain_core.messages import HumanMessage, AIMessage
from app.rag.retriever import retrieve_documents
from app.graph.workflow import graph


def test_followup_question_uses_conversation_context():

    result = graph.invoke({
        "query": "What technologies does it use?",
        "messages": [
            HumanMessage(
                content="Tell me about AgentForge."
            ),
            AIMessage(
                content=(
                    "AgentForge is an autonomous AI website builder "
                    "using specialized planner and generator agents."
                )
            ),
        ],
    })

    print("\nOriginal query:")
    print(result.get("query"))

    print("\nContextualized query:")
    print(result.get("contextualized_query"))

    print("\nIntent:")
    print(result.get("intent"))

    print("\nAnswer:")
    print(result.get("answer"))

    assert result.get("intent") == "portfolio"
    assert result.get("contextualized_query")
    assert "AgentForge" in result.get("contextualized_query")
    assert result.get("answer")
    docs = retrieve_documents(
    query="What technologies does AgentForge use?",
    k=10,
    use_expansion=True,
    )

    print("\n\n========== RETRIEVAL DEBUG ==========")

    for i, doc in enumerate(docs, 1):
        print(f"\n--- DOCUMENT {i} ---")
        print("Project:", doc.metadata.get("project_name"))
        print("Section:", doc.metadata.get("section_title"))
        print("Content:")
        print(doc.page_content[:1000])

    print("\n========== END DEBUG ==========\n")