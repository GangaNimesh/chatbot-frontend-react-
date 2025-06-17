import json
from flask import Blueprint, request, jsonify, current_app
from app.services.user_service import chat_with_groq
from app.utils.helpers import scrape_website_selenium, load_manual_data, load_keyword_instructions
from app.models.session_store import conversation_history

chat_blueprint = Blueprint("chat", __name__)

manual_data = load_manual_data()
keyword_instructions = load_keyword_instructions()
scraped_site_data = scrape_website_selenium("https://innovature.ai/")
site_data = json.dumps(manual_data, indent=2) + "\n" + scraped_site_data

@chat_blueprint.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "")
        current_app.logger.info(f"Received message: {user_input}")

        matched_keywords = [k for k in keyword_instructions if k in user_input.lower()]
        extra_instruction = ""
        if matched_keywords:
            extra_instruction = " ".join(keyword_instructions[k] for k in matched_keywords)
            extra_instruction = f"\n\nAdditional instruction: {extra_instruction}"
            current_app.logger.info(f"Matched keywords: {matched_keywords}")

        history_text = "\n".join([f"User: {pair['user']}\nBot: {pair['bot']}" for pair in conversation_history])
        final_context = site_data + extra_instruction + "\n\nPrevious Conversation:\n" + history_text

        response_text = chat_with_groq(user_input, final_context)
        conversation_history.append({"user": user_input, "bot": response_text})

        current_app.logger.info(f"Bot response: {response_text}")
        return jsonify({"response": response_text})

    except Exception as e:
        current_app.logger.exception("Error handling /chat request")
        return jsonify({"error": "Something went wrong."}), 500
