import os

from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File

from src.ingest import ingest_pdf
from src.rag import ask

app = FastAPI()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Basic RAG API Running"}


@app.post("/upload")

async def upload_pdf(file: UploadFile = File(...)):

    path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(path, "wb") as f:
        f.write(await file.read())

    chunks = ingest_pdf(path)

    return {
        "message": "PDF Uploaded Successfully",
        "chunks": chunks
    }


@app.post("/query")

async def query(data: dict):

    answer = ask(
        data["question"]
    )

    return {
        "answer": answer
    }