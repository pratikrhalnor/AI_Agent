from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models import QueryRequest, QueryResponse
from services.llm_service import llm, LLM_PROVIDER

router = APIRouter(
    prefix="/api",
    tags=["query"]
)

@router.get("/query")
def get_query(prompt: str):
    """Query endpoint via GET request"""
    if LLM_PROVIDER == "openai":
        # Using OpenAI SDK directly
        response = llm.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return QueryResponse(
            response=response.choices[0].message.content,
            provider="openai"
        )
    else:
        # Using GROQ with LangChain
        response = llm.invoke(prompt)
        return QueryResponse(
            response=response.content,
            provider="groq"
        )

@router.post("/query")
def post_query(request: QueryRequest):
    """Query endpoint via POST request"""
    if LLM_PROVIDER == "openai":
        # Using OpenAI SDK directly
        response = llm.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": request.prompt}
            ]
        )
        return QueryResponse(
            response=response.choices[0].message.content,
            provider="openai"
        )
    else:
        # Using GROQ with LangChain
        response = llm.invoke(request.prompt)
        return QueryResponse(
            response=response.content,
            provider="groq"
        )

@router.post("/query-stream")
def query_stream(request: QueryRequest):
    """Streaming query endpoint for real-time responses"""
    if LLM_PROVIDER == "openai":
        # Using OpenAI SDK directly with streaming
        def event_generator():
            stream = llm.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": request.prompt}
                ],
                stream=True
            )
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        
        return StreamingResponse(
            event_generator(),
            media_type="text/plain"
        )
    else:
        # Using GROQ with LangChain
        def event_generator():
            for chunk in llm.stream(request.prompt):
                yield chunk.content
        
        return StreamingResponse(
            event_generator(),
            media_type="text/plain"
        )