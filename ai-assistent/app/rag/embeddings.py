from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config.settings import settings

def get_embeddings() -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(
        model=settings.gemini_embedding_model,
        google_api_key=settings.gemini_api_key,
    )