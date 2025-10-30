## chatbot.py

import re
from typing import Dict, List
import random
from app.utils.sem_router import semanticrouter

class Chatbot:
    def __init__(self):
        self.patterns: List[Dict] = [
            {
                "patterns": ["chitchat"],
                "responses": [
                    "Hello! How can I help you today?",
                    "Hi there! What can I do for you?",
                    "Hey! How may I assist you?",
                    "Whats up! I'm doing great, thank you for asking! How can I help you?",
                    "Hey! I'm good! What can I assist you with today?"
                ]
            },
            {
                "patterns": ["goodbye_message"],
                "responses": [
                    "Goodbye! Have a great day!",
                    "See you later! Feel free to come back anytime!",
                    "Bye! Take care!"
                ]
            },
            {
                "patterns": ["gratitude"],
                "responses": [
                    "You're welcome!",
                    "Happy to help!",
                    "Anytime! Let me know if you need anything else."
                ]
            },
            {
                "patterns": ["identity"],
                "responses": [
                    "I'm a chatbot assistant here to help you!",
                    "I'm your friendly chatbot. How can I assist you today?"
                ]
            },
            {
                "patterns": ["help", "support", "assist"],
                "responses": [
                    "I'm here to help! You can ask me questions and I'll do my best to assist you.",
                    "Sure! What do you need help with?"
                ]
            },
            {
                "patterns": ["weather"],
                "responses": [
                    "I don't have access to real-time weather data, but you can check your local weather service!",
                    "Sorry, I can't check the weather right now. Try a weather website!"
                ]
            },
            {
                "patterns": ["price", "cost", "how much"],
                "responses": [
                    "For pricing information, please contact our sales team or check our pricing page.",
                    "I'd recommend visiting our pricing page for the most up-to-date information!"
                ]
            }
        ]
        
        self.default_responses = [
            "I'm not sure I understand. Could you rephrase that?",
            "Interesting question! Can you provide more details?",
            "I'm still learning. Could you ask that differently?",
            "Hmm, I don't have an answer for that yet. Try asking something else!"
        ]

        self.semantic_router = semanticrouter()
    
    def get_response(self, user_message: str) -> str:
        """
        Generate a response based on pattern matching
        """
        user_message = user_message.lower().strip()
        
        # 1. Route messages with semantic router
        route = self.semantic_router.router(user_message)

        # return str(route.name)

        # Check each pattern
        for pattern_group in self.patterns:
            for pattern in pattern_group["patterns"]:
                if re.search(r'\b' + pattern + r'\b', str(route.name)):
                    return random.choice(pattern_group["responses"])
        
        # If no pattern matches, return default response
        return random.choice(self.default_responses)