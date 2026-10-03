from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

from langchain_core.messages import HumanMessage, AIMessage

from app.graph.workflow import graph

router = APIRouter(prefix="/api", tags=["Chat"])


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    query: str = Field(max_length=500)
    messages: list[ChatMessage] = Field(default_factory=list, max_length=6)


class ChatResponse(BaseModel):
    answer: str
    intent: str | None = None


def convert_messages(messages: list[ChatMessage]):
    converted = []

    for message in messages:
        if message.role == "user":
            converted.append(
                HumanMessage(content=message.content)
            )
        elif message.role == "assistant":
            converted.append(
                AIMessage(content=message.content)
            )

    return converted


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        if not request.query.strip():
            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty."
            )

        chat_history = convert_messages(request.messages)

        result = graph.invoke({
            "query": request.query,
            "messages": chat_history,
        })

        return ChatResponse(
            answer=result.get(
                "answer",
                "I don't have that information in Pourush's portfolio/project knowledge base.",
            ),
            intent=result.get("intent"),
        )

    except HTTPException:
        raise

    except Exception:
        import traceback

        print("\n" + "=" * 80)
        print("CHAT API ERROR")
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=500,
            detail="Failed to process query."
        )