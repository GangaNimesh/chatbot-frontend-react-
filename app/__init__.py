from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

def get_next_log_filename(log_dir='logs', base_name='log', ext='log'):
    counter = 1
    while True:
        filename = os.path.join(log_dir, f"{base_name}{counter}.{ext}")
        if not os.path.exists(filename):
            return filename
        counter += 1

def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app)

    os.makedirs("logs", exist_ok=True)

    log_filename = get_next_log_filename()

    log_formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")
    file_handler = logging.FileHandler(log_filename)
    file_handler.setFormatter(log_formatter)
    file_handler.setLevel(logging.INFO)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(logging.INFO)

    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)
    app.logger.info(f"Logging to {log_filename}")

    from .routes.routes import chat_blueprint
    app.register_blueprint(chat_blueprint)
    app.logger.info("App created and blueprint registered.")

    return app
