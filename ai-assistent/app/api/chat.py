from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.graph.workflow import graph

router = APIRouter(prefix="/api", tags=["Chat"])


class ChatRequest(BaseModel):
    query: str
    messages: list[dict] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    intent: str | None = None


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        if not request.query.strip():
            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty."
            )

        result = graph.invoke({
            "query": request.query,
            "messages": request.messages,
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

    except Exception as e:
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