from app.graph.router import classify_intent


TEST_CASES = [
    # casual
    ("Hi", "casual"),
    ("Hello, how are you?", "casual"),
    ("Good morning", "casual"),
    ("Thanks for your help", "casual"),

    # portfolio
    ("What projects has Pourush built?", "portfolio"),
    ("Tell me about AgentForge", "portfolio"),
    ("What did Pourush work on during his internship?", "portfolio"),
    ("What technologies does Pourush know?", "portfolio"),
    ("What is Pourush's CGPA?", "portfolio"),
    ("Tell me about his AI projects", "portfolio"),
    ("How many LeetCode problems has he solved?", "portfolio"),

    # contact
    ("How can I contact Pourush?", "contact"),
    ("What is Pourush's email?", "contact"),
    ("Give me his LinkedIn", "contact"),
    ("Give me his GitHub", "contact"),
    ("What is his LeetCode profile?", "contact"),

    # other
    ("What is the weather today?", "other"),
    ("Explain quantum computing", "other"),
    ("Write a Python sorting algorithm", "other"),
    ("Who is Elon Musk?", "other"),
]


def test_intent_classifier():
    passed = 0

    for query, expected in TEST_CASES:

        state = {
            "query": query
        }

        result = classify_intent(state)

        actual = result["intent"]

        if actual == expected:
            print(f"✅ {query}")
            print(f"   → {actual}")
            passed += 1
        else:
            print(f"❌ {query}")
            print(f"   Expected: {expected}")
            print(f"   Got:      {actual}")

    print()
    print(f"Passed: {passed}/{len(TEST_CASES)}")

    assert passed == len(TEST_CASES)