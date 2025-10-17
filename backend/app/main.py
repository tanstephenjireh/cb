from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.chatbot import RuleBasedChatbot
from datetime import datetime

app = FastAPI(title="Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot
chatbot = RuleBasedChatbot()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str

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