from app.rag.retriever import retrieve_documents

# (question, text unique to the correct chunk, max allowed rank)
TEST_CASES = [
    ("What was Pourush's internship project?", "Correct internship project", 1),
    ("What did Pourush work on at Solitair Infosys?", "Correct internship project", 1),
    ("What did he build at Solitaire Infosys?", "Correct internship project", 1),
    ("Which project did he complete during his internship?", "Correct internship project", 1),
    ("Tell me about his internship", "Correct internship project", 2),
    ("Who is Pourush Kashyap?", "AI-ML Engineer in the making", 1),
    ("How can I contact Pourush?", "pourushkashyap06@gmail.com", 1),
    ("What is his LinkedIn?", "linkedin.com/in/pourush-kashyap", 1),
    ("What is his LeetCode profile?", "leetcode.com/u/_pourush2005", 1),
    ("Where did he study and what is his CGPA?", "CT University", 1),
    ("How many DSA problems has he solved?", "1200+", 1),
    ("What technologies does Pourush use?", "Redux Toolkit", 1),
    ("What is Pourush currently learning?", "AI evaluation and production reliability", 2),
    ("What are his future project plans?", "Deepen tool-using agents", 1),
    ("What is the difference between his current features and future roadmap?", "Deepen tool-using agents", 2),
    ("Has he won any awards?", "Best Startup Award", 1),
    ("How does SilentSOS process audio?", "43-dimensional", 2),
    ("Explain AgentForge's multi-agent architecture.", "Requirement Analyzer", 2),
    ("Explain FinGrow end to end.", "Flask financial-analysis service", 1),
    ("What is CodePilot AI and how does its RAG pipeline work?", "Repository ingestion", 1),
    ("How does the Self-Healing Debugger safely apply fixes?", "sandbox", 1),
    ("How does FitGenius AI make recommendations?", "Scikit-learn model", 1),
]

OUT_OF_SCOPE = [
    "Does Pourush know Rust?",
    "What is Pourush's salary expectation?",
]

K = 4


def main():
    passed = 0

    for question, expected, max_rank in TEST_CASES:
        documents = retrieve_documents(question, k=K)

        found_at = None
        for rank, document in enumerate(documents, start=1):
            if expected.lower() in document.page_content.lower():
                found_at = rank
                break

        ok = found_at is not None and found_at <= max_rank
        passed += 1 if ok else 0

        if ok:
            status = f"PASS (rank {found_at})"
        elif found_at:
            status = f"WEAK (rank {found_at}, wanted <= {max_rank})"
        else:
            status = "FAIL (not in top results)"

        print("\n" + "=" * 100)
        print(f"[{status}] {question}")
        print(f"expected text: {expected!r}")
        print("-" * 100)

        for rank, document in enumerate(documents, start=1):
            title = document.metadata.get("section_title", "?")
            project = document.metadata.get("project_name", "-")
            page = document.metadata.get("page")
            print(f"  {rank}. page {page} | {title} | project: {project}")

    print("\n" + "#" * 100)
    print(f"RESULT: {passed}/{len(TEST_CASES)} passed")
    print("#" * 100)

    print("\nOUT-OF-SCOPE QUESTIONS (top results should look unrelated):")
    for question in OUT_OF_SCOPE:
        documents = retrieve_documents(question, k=2)
        print(f"\n  Q: {question}")
        for document in documents:
            print(f"     -> {document.metadata.get('section_title', '?')}")


if __name__ == "__main__":
    main()