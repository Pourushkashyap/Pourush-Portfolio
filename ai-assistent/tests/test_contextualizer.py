from langchain_core.messages import HumanMessage, AIMessage

from app.services.contextualizer import contextualize_query


def test_contextualize_agentforge_followup():

    messages = [
        HumanMessage(
            content="Tell me about AgentForge."
        ),
        AIMessage(
            content=(
                "AgentForge is an autonomous AI website builder "
                "that uses specialized planner and generator agents."
            )
        ),
    ]

    query = "What technologies does it use?"

    rewritten = contextualize_query(
        query=query,
        messages=messages,
    )

    print("\nOriginal:")
    print(query)

    print("\nRewritten:")
    print(rewritten)

    assert rewritten
    assert "AgentForge" in rewritten


def test_self_contained_query():

    messages = [
        HumanMessage(
            content="Tell me about AgentForge."
        ),
        AIMessage(
            content="AgentForge is an autonomous AI website builder."
        ),
    ]

    query = "What is Pourush's CGPA?"

    rewritten = contextualize_query(
        query=query,
        messages=messages,
    )

    print("\nOriginal:")
    print(query)

    print("\nRewritten:")
    print(rewritten)

    assert rewritten
    assert "CGPA" in rewritten