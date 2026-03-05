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
    print("Warning: The 'groq' library is not installed. AI features will be disabled.")
    Groq = None


app = Flask(__name__)
# Configure CORS origins from environment for production (comma-separated).
# If ALLOWED_ORIGINS is not set, default to allowing all origins (development).
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*")
if allowed_origins.strip() == "*":
    CORS(app)
else:
    # split comma-separated list and strip whitespace
    origins = [o.strip() for o in allowed_origins.split(",") if o.strip()]
    CORS(app, origins=origins)

# Initialize Groq client
# Make sure to set your API key: export GROQ_API_KEY='your_key'
api_key = os.environ.get("GROQ_API_KEY")
client = None
if Groq is None:
    # groq library missing; keep client None and handle at request time
    client = None
else:
    if not api_key:
        print("Warning: GROQ_API_KEY is not set. AI features will be disabled until it's configured.")
        client = None
    else:
        try:
            client = Groq(api_key=api_key)
        except Exception as e:
            print(f"Warning: Failed to initialize Groq client: {e}")
            client = None
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
        "content": "Act as PolySEA: SEA language tutor (Thai/Vietnamese/Indonesian/Filipino). Concise, supportive.Speak English by default; use the target language only for the phrase/examples. Use templates: TEACH: Phrase | Meaning | Breakdown | Pronunciation | Example FIX: Original | Corrected | Why | Your turn ROLEPLAY: Scene + 1–2 lines dialogue; pause for user. End with one question."
    }

    messages = [system_prompt] + history + [{"role": "user", "content": user_message}]

    try:
        if client is None:
            return jsonify({"response": "AI backend not configured. Set GROQ_API_KEY and install groq library."}), 502

        chat_completion = client.chat.completions.create(
            messages=messages,
            model=MODEL_NAME,
        )
        bot_response = chat_completion.choices[0].message.content
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"response": f"Error connecting to AI: {str(e)}. Check GROQ_API_KEY and GROQ_MODEL."}), 502


@app.route('/health', methods=['GET'])
def health():
    # Simple health check for load balancers and probes
    return jsonify({"status": "ok", "service": "polysea"}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", "5050"))
    app.run(debug=True, host="127.0.0.1", port=port)
