import json
import re


def parse_llm_json(text: str) -> dict | None:
    """
    Parse JSON from an LLM reply. Handles markdown fences and extra text
    around the JSON object. Returns None if nothing valid is found.
    """
    cleaned = re.sub(r"```(?:json)?", "", text).strip()

    candidates = [cleaned]

    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        candidates.append(match.group(0))

    for candidate in candidates:
        try:
            result = json.loads(candidate)
        except json.JSONDecodeError:
            continue

        if isinstance(result, dict):
            return result

    return None