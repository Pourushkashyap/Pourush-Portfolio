from langchain_core.messages import HumanMessage, AIMessage

from app.graph.state import ChatState


def test_chat_state_supports_messages():

    state: ChatState = {
        "query": "What technologies does it use?",
        "messages": [
            HumanMessage(
                content="Tell me about AgentForge."
            ),
            AIMessage(
                content="AgentForge is an autonomous AI website builder."
            ),
        ],
    }

    assert len(state["messages"]) == 2
    assert state["messages"][0].content == "Tell me about AgentForge."
    assert (
        state["messages"][1].content
        == "AgentForge is an autonomous AI website builder."
    )