import os #accessing api key from env
import json
import requests #http requests to groq
from flask import current_app, jsonify
from app.utils.helpers import scrape_website_selenium, load_manual_data, load_keyword_instructions
from app.models.session_store import conversation_history

API_KEY = os.getenv("GROQ_API_KEY")
URL = "https://api.groq.com/openai/v1/chat/completions"

manual_data = load_manual_data()
keyword_instructions = load_keyword_instructions()
scraped_site_data = scrape_website_selenium("https://innovature.ai/")
site_data = json.dumps(manual_data, indent=2) + "\n" + scraped_site_data #manual+scraped data

def chat_with_groq(user_prompt, context_data):
    headers ={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an AI assistant which answers the questions related to Innovature only. Prefer manual information provided by the user over scraped content when they conflict. "
                    "Do NOT mention or comment on the amount or nature of the context given. "
                    "Provide direct, concise answers without meta-comments about the data."
                    "If the user asks for information not in the context, say that you don't have the information politely."
                    "If the user claims that they are one of the executive member of innovature, tell them that you are not the executive member and give the right information politely."
                    "Always prioritize the user-provided context and conversation history over scraped or generic information. "
                    "Respond in a way that continues the ongoing conversation. If the user asks a vague question like 'more details', relate it to the previous topic. "
                    "If you do not have sufficient info, politely say so. Do NOT guess or fabricate details."
                    "Answer briefly and clearly. Do not include disclaimers, guesses, or irrelevant details."
                    "Never make up titles, names, roles, or claims unless provided."
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
        session_id = data.get("sessionId")
        if not session_id:
            return jsonify({"error": "Missing session ID"})
        current_app.logger.info(f"[Session {session_id}] User: {user_input}")
        matched_keywords = [k for k in keyword_instructions if k in user_input.lower()]
        extra_instruction = ""
        if matched_keywords:
            extra_instruction = " ".join(keyword_instructions[k] for k in matched_keywords)
            extra_instruction = f"\n\nAdditional instruction: {extra_instruction}"
            current_app.logger.info(f"[Session {session_id}] Matched keywords: {matched_keywords}")
        if session_id not in conversation_history:
            conversation_history[session_id] =[]
        session_history = conversation_history[session_id]
        history_text = "\n".join([f"User: {pair['user']}\nBot: {pair['bot']}" for pair in session_history])
        final_context = site_data+extra_instruction+history_text
        response_text = chat_with_groq(user_input, final_context)
        current_app.logger.info(f"[Session {session_id}] Bot: {response_text}")
        conversation_history[session_id].append({"user": user_input, "bot": response_text})
        return jsonify({"response": response_text})
    except Exception:
        current_app.logger.exception("Error in handle_chat_request.")
        return jsonify({"response": "Something went wrong"})
