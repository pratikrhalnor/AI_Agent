from pydantic import BaseModel
from typing import Optional

class QueryRequest(BaseModel):
    """Request model for query endpoint"""
    prompt: str

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "What is the capital of France?"
            }
        }

class QueryResponse(BaseModel):
    """Response model for query endpoint"""
    response: str
    provider: str  # "groq" or "openai"

    class Config:
        json_schema_extra = {
            "example": {
                "response": "The capital of France is Paris.",
                "provider": "groq"
            }
        }

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "status": "Online",
                "message": "Simple Agent API is running"
            }
        }