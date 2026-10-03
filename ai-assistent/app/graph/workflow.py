from langgraph.graph import StateGraph, START, END

from app.graph.state import ChatState
from app.graph.router import (
    classify_intent,
    route_by_intent,
)
from app.graph.nodes import (
    casual_response,
    contact_response,
    refusal_response,
    not_found_response,
    contextualize,

    query_transform,

    retrieve,
    answerability,
    generate,
    validate,
    route_after_answerability,
    route_after_validate,
)


def build_graph():
    graph = StateGraph(ChatState)

    # -------------------------
    # Nodes
    # -------------------------
    graph.add_node("contextualize", contextualize)
    graph.add_node("intent_router", classify_intent)

    graph.add_node("casual_response", casual_response)
    graph.add_node("contact_response", contact_response)
    graph.add_node("refusal", refusal_response)
    graph.add_node("not_found", not_found_response)
    graph.add_node(
    "query_transform",
    query_transform,
)
    graph.add_node("retrieve", retrieve)
    graph.add_node("answerability", answerability)
    graph.add_node("generate", generate)
    graph.add_node("validate", validate)

    # -------------------------
    # Entry
    # -------------------------
    graph.add_edge(START, "contextualize")
    graph.add_edge("contextualize", "intent_router")

    # -------------------------
    # Intent routing
    # -------------------------
    graph.add_conditional_edges(
        "intent_router",
        route_by_intent,
        {
            "casual": "casual_response",
            "contact": "contact_response",
            "portfolio": "query_transform",
            "other": "refusal",
        },
    )
    graph.add_edge(
    "query_transform",
    "retrieve",
)

    # -------------------------
    # Simple branches
    # -------------------------
    graph.add_edge("casual_response", END)
    graph.add_edge("contact_response", END)
    graph.add_edge("refusal", END)
    graph.add_edge("not_found", END)

    # -------------------------
    # Portfolio RAG
    # -------------------------
    graph.add_edge("retrieve", "answerability")

    graph.add_conditional_edges(
        "answerability",
        route_after_answerability,
        {
            "generate": "generate",
            "not_found": "not_found",
        },
    )

    # -------------------------
    # Generate → Validate
    # -------------------------
    graph.add_edge("generate", "validate")

    # -------------------------
    # Validation routing
    # -------------------------
    graph.add_conditional_edges(
        "validate",
        route_after_validate,
        {
            "done": END,
            "retry": "generate",
            "not_found": "not_found",
        },
    )

    return graph.compile()


graph = build_graph()