"""
Runs real questions through the whole graph (uses the real LLM and APIs) and
checks the SHAPE of each answer.   python -m tests.try_formats
"""

from app.graph.workflow import graph

# (question, kind)
CASES = [
    ("Does Pourush know React?", "yesno"),
    ("Does he know Python?", "yesno"),
    ("Has he used LangGraph in a project?", "yesno"),
    ("What is his CGPA?", "fact"),
    ("Where does he study?", "fact"),
    ("What are his frontend skills?", "list"),
    ("What databases does he use?", "list"),
    ("How does SilentSOS detect danger?", "explain"),
    ("What is Pourush's salary expectation?", "notfound"),
]

MAX_WORDS = {"yesno": 30, "fact": 30, "list": 60, "explain": 120}


def check(kind: str, answer: str) -> list[str]:
    problems = []
    words = len(answer.split())

    if kind in MAX_WORDS and words > MAX_WORDS[kind]:
        problems.append(f"too long ({words} words, max {MAX_WORDS[kind]})")

    if kind == "yesno" and not answer.lower().startswith(("yes", "no")):
        problems.append("does not start with Yes/No")

    if "**" in answer or answer.lstrip().startswith("#"):
        problems.append("contains markdown bold/heading")

    for banned in ("knowledge base", "context", "strong", "expert"):
        if banned in answer.lower() and kind != "notfound":
            problems.append(f"contains '{banned}'")

    return problems


for question, kind in CASES:
    answer = graph.invoke({"query": question}).get("answer", "")
    problems = check(kind, answer)

    print("=" * 70)
    print(f"[{'OK' if not problems else 'CHECK'}] ({kind}) {question}")
    print(answer)
    for p in problems:
        print("   !!", p)