import os
from dotenv import load_dotenv #For Enviornment Variables
from langchain_groq import ChatGroq # For Groq API 
from openai import OpenAI #OpenAI SDK 

load_dotenv()

# Set API keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()  

def get_groq_llm():
    """Initialize GROQ LLM using LangChain"""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not found in .env")
    os.environ["GROQ_API_KEY"] = GROQ_API_KEY
    return ChatGroq(
        model_name="qwen/qwen3.6-27b",
        temperature=0.7
    )

def get_openai_llm():
    """Initialize OpenAI LLM using OpenAI SDK directly"""
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY not found in .env")
    return OpenAI(api_key=OPENAI_API_KEY)

def get_llm():
    """
    Get LLM instance based on provider
    
    Set LLM_PROVIDER in .env to:
    - "groq" for GROQ (uses LangChain)
    - "openai" for OpenAI (uses official SDK)
    """
    if LLM_PROVIDER == "openai":
        return get_openai_llm()
    else:
        return get_groq_llm()

# Initialize LLM
llm = get_llm()