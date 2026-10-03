from app.rag.retriever import retrieve_documents
from app.rag.context_compressor import compress_context

# (question, fact that must survive compression)
CASES = [
    ("What technologies does Pourush use?", "Redux Toolkit"),
    ("What did he build at Solitair Infosys?", "Correct internship project"),
    ("What is the difference between his current features and future roadmap?", "Deepen tool-using agents"),
]

for question, must_keep in CASES:
    docs = retrieve_documents(question, k=5, compress=False)
    full = sum(len(d.page_content) for d in docs)

    compressed = compress_context(question, docs, per_doc_chars=600, total_chars=2000)
    small = sum(len(d.page_content) for d in compressed)
    kept = any(must_keep.lower() in d.page_content.lower() for d in compressed)

    print(question)
    print(f"  chars: {full} -> {small}")
    print(f"  compressed flags: {[d.metadata.get('compressed', False) for d in compressed]}")
    print(f"  key fact kept ({must_keep!r}): {kept}")