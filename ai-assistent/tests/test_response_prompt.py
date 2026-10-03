"""Offline tests (no real LLM): python -m pytest tests/test_response_prompt.py"""

from langchain_core.documents import Document

from app.services import response_service
from app.services.response_service import (
    NOT_FOUND_MESSAGE,
    SYSTEM_PROMPT,
    format_documents,
    generate_answer,
)


class FakeLLM:
    def __init__(self, reply="  Yes, Pourush works with React.  "):
        self.reply = reply
        self.prompts = []

    def invoke(self, prompt):
        self.prompts.append(prompt)

        class Response:
            content = self.reply

        return Response()


DOCS = [Document(page_content="Frontend development: React, Tailwind CSS, Vite.")]


def test_not_found_sentence_is_unchanged():
    # nodes.validate and not_found_service compare against this exact text
    assert NOT_FOUND_MESSAGE == (
        "I don't have that information in Pourush's portfolio/project knowledge base."
    )


def test_prompt_renders_with_context_question_and_not_found_sentence(monkeypatch):
    fake = FakeLLM()
    monkeypatch.setattr(response_service, "llm", fake)

    answer = generate_answer("Does Pourush know React?", DOCS)
    prompt = fake.prompts[0]

    assert answer == "Yes, Pourush works with React."  # whitespace stripped
    assert "Frontend development: React" in prompt
    assert "Does Pourush know React?" in prompt
    assert NOT_FOUND_MESSAGE in prompt


def test_prompt_contains_the_style_rules():
    for text in (
        "Answer ONLY what was asked",
        "Yes/no question",
        "Single fact question",
        "Plain text only",
        "under 30",
    ):
        assert text in SYSTEM_PROMPT


def test_prompt_forbids_unsupported_praise_words():
    assert "strong" in SYSTEM_PROMPT and "unless the context uses those exact words" in SYSTEM_PROMPT


def test_feedback_is_added_on_retry(monkeypatch):
    fake = FakeLLM()
    monkeypatch.setattr(response_service, "llm", fake)

    generate_answer("Does Pourush know React?", DOCS, feedback="Unsupported: expert level")

    assert "previous draft was rejected" in fake.prompts[0]
    assert "Unsupported: expert level" in fake.prompts[0]


def test_no_feedback_means_no_revision_note(monkeypatch):
    fake = FakeLLM()
    monkeypatch.setattr(response_service, "llm", fake)

    generate_answer("Does Pourush know React?", DOCS)

    assert "previous draft" not in fake.prompts[0]


def test_format_documents_handles_empty_list():
    assert format_documents([]) == ""