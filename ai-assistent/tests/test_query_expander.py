from app.rag.query_expander import expand_query


def main():

    queries = [
        "What was Pourush's internship project?",
        "What did Pourush work on at Solitair Infosys?",
        "Explain AgentForge's multi-agent architecture.",
    ]

    for query in queries:

        print("\n" + "=" * 80)
        print("ORIGINAL QUERY:")
        print(query)

        expanded = expand_query(query)

        print("\nEXPANDED QUERIES:")

        for item in expanded:
            print("-", item)


if __name__ == "__main__":
    main()