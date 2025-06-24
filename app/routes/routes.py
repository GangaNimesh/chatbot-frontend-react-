from flask import Blueprint, request, jsonify
from app.services.user_service import handle_chat_request

chat_blueprint = Blueprint("chat", __name__)#BP-way to organize routes in Flask

@chat_blueprint.route("/chat", methods=["POST"])#users send messages to 'chat' via POST
def chat():
    try:
        data = request.get_json()#request chat in json
        return handle_chat_request(data)
    except Exception as e:
        return jsonify({"error": "Something went wrong."}), 500 #internal server error