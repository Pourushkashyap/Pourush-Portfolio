from app.graph.workflow import graph


def test_agentforge():

    result = graph.invoke({
        "query": "Tell me about AgentForge"
    })

    print("\n" + "=" * 60)
    print("ANSWER:")
    print(result.get("answer"))

    print("\nANSWERABLE:")
    print(result.get("is_answerable"))

    print("\nGROUNDED:")
    print(result.get("is_grounded"))

    print("\nREASON:")
    print(result.get("validation_reason"))

    print("\nUNSUPPORTED CLAIMS:")
    print(result.get("unsupported_claims"))

    assert result.get("answer")
    assert result.get("is_answerable") is True
    assert result.get("is_grounded") is True