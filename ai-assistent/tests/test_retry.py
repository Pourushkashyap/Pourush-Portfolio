from app.graph.nodes import route_after_validate
from app.graph.nodes import route_after_answerability

def test_validation_success_goes_to_done():
    state = {
        "is_grounded": True,
        "attempts": 1,
    }

    result = route_after_validate(state)

    assert result == "done"


def test_failed_validation_with_attempt_remaining_retries():
    state = {
        "is_grounded": False,
        "attempts": 1,
    }

    result = route_after_validate(state)

    assert result == "retry"


def test_failed_validation_after_max_attempts_goes_to_not_found():
    state = {
        "is_grounded": False,
        "attempts": 2,
    }

    result = route_after_validate(state)

    assert result == "not_found"


def test_answerable_goes_to_generate():
    state = {
        "is_answerable": True,
    }

    assert route_after_answerability(state) == "generate"


def test_not_answerable_goes_to_not_found():
    state = {
        "is_answerable": False,
    }

    assert route_after_answerability(state) == "not_found"