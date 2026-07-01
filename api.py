from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from SimpleAgent import llm
 # creating the server
app = FastAPI(
    title="Simple Agent API"
    
)

# for verifying the data is in same format as expected
class QueryRequest(BaseModel):
    prompt: str

# to check is api working
@app.get("/")
def root():
    return {
        "message": "Simple Agent API is running"
    }

# API endpoint working or not
@app.get("/health")
def health():
    return {
        "status": "Online"
    }

# URL Query for quick test
@app.get("/api/query")
def get_query(prompt: str):
    response = llm.invoke(prompt)
    return {
        "response": response.content
    }

# Display after generation
@app.post("/api/query")
def post_query(request: QueryRequest):
    response = llm.invoke(request.prompt)
    return {
        "response": response.content
    }

### Streaming for realtime answer

@app.post("/api/query-stream")
def query_stream(request: QueryRequest):

    def event_generator():
        for chunk in llm.stream(request.prompt):
            yield chunk.content

    return StreamingResponse(
        event_generator(),
        media_type="text/plain"
    )