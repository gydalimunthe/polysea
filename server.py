from dotenv import load_dotenv
load_dotenv()

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

try:
    from groq import Groq
except ImportError:
    print("Error: The 'groq' library is not installed.\nPlease run: pip3 install groq")
    sys.exit(1)


app = Flask(__name__)
CORS(app)

# Initialize Groq client
# Make sure to set your API key: export GROQ_API_KEY='your_key'
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    print("Error: GROQ_API_KEY is not set.")
    print("Run: export GROQ_API_KEY='your_key'")
    sys.exit(1)

client = Groq(api_key=api_key)
MODEL_NAME = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")
APP_SECRET_KEY = os.environ.get("APP_SECRET_KEY", "polysea-dev-secret")
token_serializer = URLSafeTimedSerializer(APP_SECRET_KEY)


def create_auth_token(username: str) -> str:
    return token_serializer.dumps({"username": username}, salt="auth-token")


def verify_auth_token(token: str):
    try:
        return token_serializer.loads(token, salt="auth-token", max_age=60 * 60 * 24 * 14)
    except (BadSignature, SignatureExpired):
        return None


def get_authenticated_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.replace("Bearer ", "", 1).strip()
    if not token:
        return None
    return verify_auth_token(token)


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    username = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    token = create_auth_token(username)
    return jsonify({"token": token, "user": {"username": username, "email": username}})


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    username = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400
    token = create_auth_token(username)
    return jsonify({"token": token, "user": {"username": username, "email": username}})


@app.route('/auth/me', methods=['GET'])
def auth_me():
    user = get_authenticated_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"user": user})

@app.route('/chat', methods=['POST'])
def chat():
    auth_user = get_authenticated_user()
    if not auth_user:
        return jsonify({"response": "Unauthorized. Please log in again."}), 401

    data = request.json or {}
    sender = auth_user.get("username") or "user"
    print(f"Received message: {data.get('message')} from {sender}")
    user_message = data.get('message')
    if not user_message:
        return jsonify({"response": "Missing 'message' in request body."}), 400
    # In a real app, you would manage history context here or pass it from frontend
    history = data.get('history', [])

    system_prompt = {
        "role": "system",
        "content": "You are PolySEA, a friendly and knowledgeable AI language tutor specializing in Southeast Asian languages (Thai, Vietnamese, Indonesian, Filipino). Your goal is to help users learn phrases, correct their grammar, and roleplay daily situations. Keep responses concise, encouraging, and helpful, answer everytig in English unless the words they are asking for."
    }

    messages = [system_prompt] + history + [{"role": "user", "content": user_message}]

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=MODEL_NAME,
        )
        bot_response = chat_completion.choices[0].message.content
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"response": f"Error connecting to AI: {str(e)}. Check GROQ_API_KEY and GROQ_MODEL."}), 502

if __name__ == '__main__':
    port = int(os.environ.get("PORT", "5050"))
    app.run(debug=True, host="127.0.0.1", port=port)
