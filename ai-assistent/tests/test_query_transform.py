from app.rag.query_transformer import transform_query


queries = [
    "What did he build during his internship?",
    "What technologies does Pourush use?",
    "What are his future project plans?",
    "What is the difference between his current features and future roadmap?",
]


for query in queries:

    print("\n" + "=" * 80)
    print("ORIGINAL:")
    print(query)

    result = transform_query(query)

    print("\nREWRITTEN:")
    print(result["rewritten_query"])

    print("\nEXPANDED:")
    for q in result["expanded_queries"]:
        print("-", q)

    print("\nSUB QUERIES:")
    for q in result["sub_queries"]:
        print("-", q)