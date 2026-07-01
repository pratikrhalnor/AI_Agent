from fastapi import FastAPI
from routes.query import router as query_app
from routes.health import router as health_app
app = FastAPI()
# to check is api working
@app.get("/")
def root():
    return {
        "message": "Simple Agent API is running"
    }

app.include_router(query_app)
app.include_router(health_app)