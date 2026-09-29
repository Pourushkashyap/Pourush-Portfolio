from app.graph.nodes import generate, validate
from app.rag.retriever import retrieve_documents


def test_generate_and_validate_agentforge():
    query = "Tell me about AgentForge"

    documents = retrieve_documents(
        query=query,
        k=5,
        use_expansion=True,
    )

    state = {
        "query": query,
        "documents": documents,
        "attempts": 0,
    }

    generated = generate(state)

    assert generated["answer"]
    assert generated["attempts"] == 1

    state.update(generated)

    validated = validate(state)

    assert validated["is_grounded"] is True
    assert validated["unsupported_claims"] == []