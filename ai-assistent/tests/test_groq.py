from app.llm.model import llm

response = llm.invoke("say hello and tell me a joke")

print(response.content)