## main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.chatbot import Chatbot
from datetime import datetime
from app.models.chat import (
    ChatMessage, ChatResponse
)

app = FastAPI(title="Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # React dev server
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot
chatbot = Chatbot()

@app.get("/")
async def root():
    return {"message": "Chatbot API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """
    Handle chat messages and return bot response
    """
    user_message = chat_message.message
    bot_response = chatbot.get_response(user_message)
    
    return ChatResponse(
        response=bot_response,
        timestamp=datetime.now().isoformat()
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}