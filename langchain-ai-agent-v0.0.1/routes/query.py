
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.request_models import QueryRequest
from services.llm_service import llm
router = APIRouter()

# URL Query for quick test
@router.get("/api/query")
def get_query(prompt: str):
    response = llm.invoke(prompt)
    return {
        "response": response.content
    }

# Display after generation
@router.post("/api/query")
def post_query(request: QueryRequest):
    response = llm.invoke(request.prompt)
    return {
        "response": response.content
    }

### Streaming for realtime answer

@router.post("/api/query-stream")
def query_stream(request: QueryRequest):

    def event_generator():
        for chunk in llm.stream(request.prompt):
            yield chunk.content

    return StreamingResponse(
        event_generator(),
        media_type="text/plain"
    )