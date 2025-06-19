from flask import Blueprint, request, jsonify
from app.services.user_service import handle_chat_request

chat_blueprint = Blueprint("chat", __name__)

@chat_blueprint.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        return handle_chat_request(data)
    except Exception as e:
        return jsonify({"error": "Something went wrong."}), 500 #internal server error

