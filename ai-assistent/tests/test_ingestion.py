from app.rag.loader import load_pdf
from app.rag.splitter import split_documents


PDF_PATH = "data/Pourush_Kashyap_Complete_RAG_Knowledge_Base_With_Tech_Section_Corrected.pdf"


def test_ingestion():
    documents = load_pdf(PDF_PATH)

    print(f"Documents loaded: {len(documents)}")

    chunks = split_documents(documents)

    print(f"Semantic chunks created: {len(chunks)}")

    assert len(documents) > 0
    assert len(chunks) > 0

    # Verify that project-specific technology chunks were created
    technology_chunks = [
        chunk
        for chunk in chunks
        if chunk.metadata.get("section_type") == "project_technology_stack"
    ]

    assert technology_chunks, "No project technology stack chunks were created"

    # Verify AgentForge technology information
    agentforge_chunks = [
        chunk
        for chunk in technology_chunks
        if chunk.metadata.get("project_name") == "AgentForge"
    ]

    assert agentforge_chunks, "AgentForge technology chunk was not created"

    agentforge_text = " ".join(
        chunk.page_content for chunk in agentforge_chunks
    )

    assert "LangGraph" in agentforge_text
    assert "FastAPI" in agentforge_text
    assert "React" in agentforge_text
    assert "JavaScript" in agentforge_text
    assert "Tailwind CSS" in agentforge_text
    assert "Docker" in agentforge_text

    # Important correction:
    # AgentForge should use JavaScript, not TypeScript.
    assert "TypeScript" not in agentforge_text