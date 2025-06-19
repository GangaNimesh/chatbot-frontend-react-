import os 
import json
import requests #http requests
from flask import current_app, jsonify
from app.utils.helpers import scrape_website_selenium, load_manual_data, load_keyword_instructions
from app.models.session_store import conversation_history

API_KEY = os.getenv("GROQ_API_KEY")
URL = "https://api.groq.com/openai/v1/chat/completions"

manual_data = load_manual_data()
keyword_instructions = load_keyword_instructions()
scraped_site_data = scrape_website_selenium("https://innovature.ai/")
site_data = json.dumps(manual_data, indent=2) + "\n" + scraped_site_data

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
            return "Something went wrong"
    except Exception:
        current_app.logger.exception("Exception while calling Groq API.")
        return "Something went wrong"

def handle_chat_request(data):
    try:
        user_input = data.get("message", "").strip()
        current_app.logger.info(f"User input received: {user_input}")
        matched_keywords = [k for k in keyword_instructions if k in user_input.lower()]
        extra_instruction = ""
        if matched_keywords:
            extra_instruction = " ".join(keyword_instructions[k] for k in matched_keywords)
            extra_instruction = f"\n\nAdditional instruction: {extra_instruction}"
            current_app.logger.info(f"Matched keywords: {matched_keywords}")

        session_id = data.get("sessionId")
        if not session_id:
            return jsonify({"error": "Missing session ID"}),
        if session_id not in conversation_history:
            conversation_history[session_id] = []
        session_history = conversation_history [session_id]
        history_text = "\n".join([f"User: {pair['user']}\nBot: {pair['bot']}" for pair in session_history])
        current_app.logger.info(f"Session ID: {session_id}")
        current_app.logger.info(f"User input received: {user_input}")

        final_context = site_data + extra_instruction + "\n\nPrevious Conversation:\n" + history_text

        response_text = chat_with_groq(user_input, final_context)
        conversation_history[session_id].append({"user": user_input, "bot": response_text})


        current_app.logger.info(f"Bot response: {response_text}")
        return jsonify({"response": response_text})

    except Exception:
        current_app.logger.exception("Error in handle_chat_request.")
        return jsonify({"response": "Something went wrong"})
