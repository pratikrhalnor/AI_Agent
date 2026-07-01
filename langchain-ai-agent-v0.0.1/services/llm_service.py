import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI


load_dotenv()

GROQ_API_KEY=os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()

def get_llm():
    """
    Get LLM instance based on provider
    
    Set LLM_PROVIDER in .env to:
    - "groq" for GROQ (default)
    - "openai" for OpenAI
    """
    if LLM_PROVIDER == "openai":
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not found in .env")
        return ChatOpenAI(
            api_key=OPENAI_API_KEY,
            model_name="gpt-3.5-turbo",
            temperature=0.7
        )
    else:
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in .env")
        os.environ["GROQ_API_KEY"] = GROQ_API_KEY
        return ChatGroq(
            model_name="qwen/qwen3.6-27b",
            temperature=0.7
        )

# Initialize LLM
llm = get_llm()