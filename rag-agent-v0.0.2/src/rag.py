import os

from dotenv import load_dotenv

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

from langchain.chains import RetrievalQA

from langchain_groq import ChatGroq

load_dotenv()

embedding = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

persist_directory = "src/chroma_db"

vectordb = Chroma(
    persist_directory=persist_directory,
    embedding_function=embedding
)

retriever = vectordb.as_retriever(
    search_kwargs={"k":3}
)

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama3-8b-8192"
)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff"
)


def ask(question):

    response = qa.invoke(
        {"query": question}
    )

    return response["result"]