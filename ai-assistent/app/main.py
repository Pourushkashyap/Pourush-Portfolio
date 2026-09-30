from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router


app = FastAPI(
    title="Pourush Kashyap Portfolio AI Assistant",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        'https://pourush-portfolio.vercel.app'
        # Add deployed frontend URL here after frontend deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": "Pourush Portfolio AI Assistant API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }