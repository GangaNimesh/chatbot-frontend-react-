from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from logging.handlers import RotatingFileHandler

def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app)

    os.makedirs("logs", exist_ok=True)#Creates logs if it doesnt exist

    log_formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")
    file_handler = RotatingFileHandler("logs/app.log", maxBytes=10240, backupCount=3)
    file_handler.setFormatter(log_formatter)
    file_handler.setLevel(logging.INFO)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(logging.INFO)

    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)

    app.logger.info("Logging is set up.")

    from .routes.routes import chat_blueprint
    app.register_blueprint(chat_blueprint)

    app.logger.info("App created and blueprint registered.")

    return app
