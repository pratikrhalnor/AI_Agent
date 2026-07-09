from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

from src.utils import extract_text_from_pdf

embedding = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

persist_directory = "src/chroma_db"


def ingest_pdf(pdf_path):

    text = extract_text_from_pdf(pdf_path)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )

    chunks = splitter.split_text(text)

    docs = [
        Document(page_content=chunk)
        for chunk in chunks
    ]

    vectordb = Chroma.from_documents(
        documents=docs,
        embedding=embedding,
        persist_directory=persist_directory
    )

    vectordb.persist()

    return len(docs)