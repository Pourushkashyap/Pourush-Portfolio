from app.graph.workflow import graph


def run_query(query: str):
    print("\n" + "=" * 70)
    print("QUERY:", query)

    result = graph.invoke({
        "query": query
    })

    print("INTENT:", result.get("intent"))
    print("ANSWERABLE:", result.get("is_answerable"))
    print("GROUNDED:", result.get("is_grounded"))
    print("ATTEMPTS:", result.get("attempts"))
    print("ANSWERABILITY REASON:", result.get("answerability_reason"))
    print("VALIDATION REASON:", result.get("validation_reason"))
    print("UNSUPPORTED CLAIMS:", result.get("unsupported_claims"))
    print("ANSWER:")
    print(result.get("answer"))

    return result


# ---------------------------------------------------------
# 1. Casual
# ---------------------------------------------------------

def test_casual():
    result = run_query("Hi")

    assert result.get("intent") == "casual"
    assert result.get("answer")


# ---------------------------------------------------------
# 2. Contact
# ---------------------------------------------------------

def test_contact():
    result = run_query("What is Pourush's email?")

    assert result.get("intent") == "contact"
    assert "@" in result.get("answer", "")


# ---------------------------------------------------------
# 3. Portfolio - supported
# ---------------------------------------------------------

def test_agentforge():
    result = run_query("Tell me about AgentForge")

    assert result.get("intent") == "portfolio"
    assert result.get("is_answerable") is True
    assert result.get("is_grounded") is True
    assert result.get("answer")


# ---------------------------------------------------------
# 4. Portfolio - another supported question
# ---------------------------------------------------------

def test_silentsos():
    result = run_query("Tell me about SilentSOS")

    assert result.get("intent") == "portfolio"
    assert result.get("is_answerable") is True
    assert result.get("is_grounded") is True
    assert result.get("answer")


# ---------------------------------------------------------
# 5. Unsupported portfolio information
# ---------------------------------------------------------

def test_unknown_technology():
    result = run_query("Does Pourush know Rust?")

    assert result.get("intent") == "portfolio"
    assert result.get("is_answerable") is False
    assert result.get("answer")


# ---------------------------------------------------------
# 6. Out-of-scope question
# ---------------------------------------------------------

def test_out_of_scope():
    result = run_query("What is the weather today?")

    assert result.get("intent") == "other"
    assert result.get("answer")


# ---------------------------------------------------------
# 7. Unsupported project detail
# ---------------------------------------------------------

def test_unsupported_deployment():
    result = run_query(
        "Did Pourush deploy AgentForge to AWS?"
    )

    assert result.get("intent") == "portfolio"
    assert result.get("answer")


# ---------------------------------------------------------
# 8. Project list
# ---------------------------------------------------------

def test_projects():
    result = run_query(
        "What projects has Pourush built?"
    )

    assert result.get("intent") == "portfolio"
    assert result.get("is_answerable") is True
    assert result.get("answer")