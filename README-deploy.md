Render / Generic Linux deploy notes

Issue observed:
- Deploy log failed with `bash: line 1: gunicorn: command not found` because `gunicorn` wasn't installed during build.

Fix applied:
- Added `gunicorn` to `requirements.txt` so the package is installed during build.

Recommended start command for Render Web Service (set this in Render dashboard):

  gunicorn server:app --bind 0.0.0.0:$PORT --workers 3

Notes:
- The app entry point is `server.py` and the Flask app object is named `app`.
- Do NOT use the default Render start command that points at `main:app` unless you rename `server.py` to `main.py` or change the command accordingly.
- Ensure environment variables are set in the Render dashboard: `GROQ_API_KEY`, `GROQ_MODEL`, `APP_SECRET_KEY`.
- If you accidentally committed your `.env` containing secrets, rotate those secrets immediately and add `.env` to `.gitignore`.

Alternative (quick dev):
- You can also run `python server.py` as the start command for testing, but `gunicorn` is recommended for production.

Troubleshooting:
- If deploy still fails, check the build logs to verify `pip install -r requirements.txt` installed gunicorn.
- For a custom Procfile-based flow or other platforms, use the same gunicorn command shown above.

Security reminder:
- Keep `GROQ_API_KEY` secret. Don't expose it to client-side code.
