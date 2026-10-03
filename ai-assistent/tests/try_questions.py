from app.graph.workflow import graph

QUESTIONS = [
    "Does Pourush know Rust?",              # unknown skill -> "isn't listed" + contact
    "What is Pourush's salary expectation?",  # private topic -> "discuss directly" + contact
    "What is his favourite food?",          # unknown -> generic + contact
    "What is his email?",                   # must still give the contact answer
    "What is his CGPA?",                    # normal question, must still answer from the PDF
    "Does he know Python?", 
    "Does he know Python?",
    "Does he know React?",
    "What are his skills?",# a skill that IS listed, must answer yes
]

for question in QUESTIONS:
    result = graph.invoke({"query": question})
    print("=" * 70)
    print("Q:", question)
    print("INTENT:", result.get("intent"))
    print(result.get("answer"))