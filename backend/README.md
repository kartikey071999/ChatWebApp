# ChatWebApp — Backend

This folder contains the FastAPI backend for ChatWebApp. It exposes REST endpoints
and WebSocket endpoints for real-time chat.

## Overview

- REST API base: `/api/v1/`
  - Users: `/api/v1/users/`
  - Messages: `/api/v1/messages/`
- WebSocket endpoint: `ws://<host>:<port>/api/v1/ws/{user_id}`

> Notes: Authentication is not included by default. Add token-based auth for
production and secure WebSocket connections.

## Prerequisites

- Python 3.10+ (this project was tested with Python 3.13)
- Git (optional)

## Setup (recommended)

1. Create a virtual environment inside the `backend` folder:

```pwsh
python -m venv backend/.venv
```

2. Activate the venv (PowerShell):

```pwsh
. .\backend\.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```pwsh
python -m pip install -r backend/requirements.txt
```

4. Start the backend (project root):

```pwsh
# recommended runner (supports CLI options)
python main.py

# or (convenience) from backend folder
python backend/main.py
```

The API docs will be available at `http://127.0.0.1:8000/docs`.

## WebSocket usage

Connect to the WebSocket endpoint using the user's id as the path parameter:

```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/api/v1/ws/<USER_ID>');
ws.onmessage = ev => console.log('msg', JSON.parse(ev.data));
ws.onopen = () => ws.send(JSON.stringify({ receiver_id: '<OTHER_ID>', content: 'Hi' }));
```

The server persists messages to the database and delivers them in real-time
if the recipient is connected. The sender receives an acknowledgement
containing delivery status and the saved message metadata.

## Configuration

- By default the app uses `DATABASE_URL` environment variable (see `.env`),
  falling back to `sqlite:///./test.db` for development.
- For production use a real database and a migration tool (Alembic).

## Next steps / Recommendations

- Add authentication for both REST and WebSocket endpoints.
- Add Alembic migrations and remove automatic `init_db()` on startup.
- Add integration tests for WebSocket flows and REST endpoints.

If you want, I can: add authentication to WebSockets, wire the frontend to WS,
or create Alembic migrations.
