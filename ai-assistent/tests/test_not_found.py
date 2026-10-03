"""Offline tests (no LLM, no vector store needed): python -m pytest tests/test_not_found.py"""

import pytest

from app.services import not_found_service
from app.services.not_found_service import build_not_found_answer
from app.services.response_service import NOT_FOUND_MESSAGE

CONTACT = {
    "email": "pourushkashyap06@gmail.com",
    "phone": "+91 79863 55170",
    "linkedin": "https://www.linkedin.com/in/pourush-kashyap-68890a289/",
}


@pytest.fixture(autouse=True)
def contact_info(monkeypatch):
    monkeypatch.setattr(not_found_service, "get_contact_info", lambda: CONTACT)


def test_unknown_skill_says_not_listed_and_gives_contact():
    answer = build_not_found_answer("Does Pourush know Rust?")

    assert "isn't listed" in answer
    assert CONTACT["email"] in answer
    assert CONTACT["phone"] in answer
    assert answer != NOT_FOUND_MESSAGE


def test_salary_goes_to_direct_conversation():
    answer = build_not_found_answer("What is Pourush's salary expectation?")

    assert "discussed with him directly" in answer
    assert CONTACT["email"] in answer
    assert CONTACT["phone"] in answer


def test_other_unknown_question_gets_generic_message_with_contact():
    answer = build_not_found_answer("What is his favourite food?")

    assert answer.startswith("I don't have that information")
    assert CONTACT["email"] in answer


def test_linkedin_is_not_added():
    assert "linkedin" not in build_not_found_answer("Does he know Go?").lower()


def test_no_contact_info_still_returns_clean_message(monkeypatch):
    monkeypatch.setattr(not_found_service, "get_contact_info", lambda: {})

    answer = build_not_found_answer("Does Pourush know Rust?")

    assert "Email:" not in answer
    assert "isn't listed" in answer


def test_contact_lookup_failure_does_not_break_the_answer(monkeypatch):
    def boom():
        raise RuntimeError("vector store unavailable")

    monkeypatch.setattr(not_found_service, "get_contact_info", boom)

    assert "isn't listed" in build_not_found_answer("Does Pourush know Rust?")


def test_validate_node_replaces_the_bare_not_found_message():
    from app.graph.nodes import validate

    result = validate(
        {
            "query": "Does Pourush know Rust?",
            "answer": NOT_FOUND_MESSAGE,
            "documents": [],
        }
    )

    assert result["is_grounded"] is True
    assert result["answer"] != NOT_FOUND_MESSAGE
    assert CONTACT["email"] in result["answer"]


def test_not_found_node_uses_the_resolved_question():
    from app.graph.nodes import not_found_response

    result = not_found_response(
        {
            "query": "does he know it?",
            "contextualized_query": "Does Pourush know Rust?",
        }
    )

    assert "isn't listed" in result["answer"]
    assert CONTACT["email"] in result["answer"]