"""Offline tests: python -m pytest tests/test_pronouns.py"""

import pytest

from app.services.pronouns import resolve_owner_pronouns


@pytest.mark.parametrize(
    "query, expected",
    [
        ("Does he know Python?", "Does Pourush know Python?"),
        ("Does he know React?", "Does Pourush know React?"),
        ("What is his CGPA?", "What is Pourush's CGPA?"),
        ("Tell me about his projects", "Tell me about Pourush's projects"),
        ("Where did he study?", "Where did Pourush study?"),
        ("Has he won any awards?", "Has Pourush won any awards?"),
        ("Tell me about him", "Tell me about Pourush"),
        ("He built FinGrow, right?", "Pourush built FinGrow, right?"),
        ("What's his email?", "What's Pourush's email?"),
    ],
)
def test_pronouns_become_the_owner_name(query, expected):
    assert resolve_owner_pronouns(query) == expected


@pytest.mark.parametrize(
    "query",
    [
        "Does Pourush know Python?",
        "Tell me about AgentForge",
        "What is the weather today?",   # "the", "weather" contain "he" but are not the word
        "She asked about the theme",    # "she", "the", "theme"
    ],
)
def test_other_text_is_unchanged(query):
    assert resolve_owner_pronouns(query) == query


def test_contextualize_node_resolves_pronouns():
    from app.graph.nodes import contextualize

    result = contextualize({"query": "Does he know Python?", "messages": []})

    assert result["contextualized_query"] == "Does Pourush know Python?"