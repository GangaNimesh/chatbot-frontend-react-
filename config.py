import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False