import os#for reading environment variables
import requests#for making HTTP requests
from flask import current_app#for logging

API_KEY = os.getenv("GROQ_API_KEY")
URL = "https://api.groq.com/openai/v1/chat/completions"

def chat_with_groq(user_prompt, context_data):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an AI assistant. Prefer manual information provided by the user over scraped content when they conflict. "
                    "Do NOT mention or comment on the amount or nature of the context given. "
                    "Provide direct, concise answers without meta-comments about the data."
                )
            },
            {
                "role": "user",
                "content": f"{context_data}\n\nUser question: {user_prompt}"
            }
        ],
        "max_completion_tokens": 150
    }

    try:
        response = requests.post(URL, json=payload, headers=headers)
        if response.status_code == 200:
            result = response.json()["choices"][0]["message"]["content"]
            current_app.logger.info("Groq API responded successfully.")
            return result
        else:
            current_app.logger.error(f"Groq API error {response.status_code}: {response.text}")
            return f"Error: {response.text}"
    except Exception as e:
        current_app.logger.exception("Exception occurred while communicating with Groq API.")
        return f"Exception: {str(e)}"
