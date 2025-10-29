from semantic_router import Route
from semantic_router.encoders import OpenAIEncoder
from semantic_router.routers import SemanticRouter
from dotenv import load_dotenv
import os

load_dotenv()

# Access your keys
openai_key = os.getenv("OPENAI_KEY")

# print(f"OpenAI Key: {openai_key}")

class semanticrouter:
    def __init__(self):

        self.politics = Route(
            name="politics",
            utterances=[
                "isn't politics the best thing ever",
                "why don't you tell me about your political opinions",
                "don't you just love the president",
                "don't you just hate the president",
                "they're going to destroy this country!",
                "they will save the country!",
            ],
        )

        self.chitchat = Route(
            name="chitchat",
            utterances=[
                "hello",
                "hi",
                "hey",
                "greetings",
                "how are you",
                "how's it going",
                "what's up"
            ],
        )

        self.goodbye_message = Route(
            name="goodbye_message",
            utterances=[
                "bye",
                "goodbye",
                "see you",
                "see ya"
            ],
        )

        self.gratitude = Route(
            name="gratitude",
            utterances=[
                "thank",
                "thanks",
                "thank you",
                "thank you so much",
                "i appreciate that"
            ],
        )

        self.identity = Route(
            name="identity",
            utterances=[
                "your name",
                "who are you",
                "what are you",
                "who made you"
            ],
        )

        # Define Routes
        self.routes = [self.politics, 
                  self.chitchat, 
                  self.goodbye_message,
                  self.gratitude,
                  self.identity]

        # Define embedding model
        self.encoder = OpenAIEncoder(name="text-embedding-3-small",
                                openai_api_key=openai_key)

        # Initialize the router
        self.router = SemanticRouter(encoder=self.encoder, routes=self.routes, auto_sync="local")


    def router(self):
        return self.router
    

# route = sr("don't you love politics?")
# print(route.name)