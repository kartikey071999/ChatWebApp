# ChatWebApp

Lightweight Slack-like chat application (backend + frontend). This repository contains a FastAPI backend (with REST + WebSocket) and a React/Vite frontend scaffold. The backend uses SQLite for development and can be migrated to PostgreSQL for production.

Quick links
- Backend: `backend/`
- Frontend: `frontend/`

Highlights
- REST API for users, channels and messages
- WebSocket realtime channel messaging with presence (join/leave events)
- Simple role model (`admin` / `user`) and admin-only channel creation
- Messages are persisted to the database when sent over WebSocket
- Minimal light-theme frontend scaffold (Vite + React)

What I implemented
- App factory in `backend/app.py` with versioned API routers under `/api/v1`
- Models in `backend/models.py`: `User`, `Channel`, `ChannelMember`, `Message`
- Pydantic schemas in `backend/schemas.py`
- Password encryption helpers in `backend/crypto.py` (Fernet — development only)
- REST endpoints in `backend/api/v1/`:
  - `users.py` — register, login, get user, list users
  - `channels.py` — create (admin), list, get, join, members
  - `messages.py` — send/get history
  - `ws.py` — WebSocket channel handler (realtime)
- WebSocket realtime path: `/api/v1/ws/channels/{channel_id}/{user_id}` — accepts raw text or JSON (`{"content":"..."}`)

Quickstart (development)
These commands assume a terminal at the repository root. Replace `python`/`npm` with your preferred executables if needed.

1) Backend: activate the virtual environment (from repo root):

```powershell
cd backend
. .venv\Scripts\Activate.ps1
```

2) Initialize the database and verify imports (run from repo root):

```powershell
cd ..
python -c "from backend.app import app; from backend.database import init_db; init_db(); print('√ App initialized'); print(f'√ Routes: {len(app.routes)}')"
```

3) Start the backend server (from repo root):

```powershell
python backend/main.py --host 127.0.0.1 --port 8000
```

4) Frontend (in the `frontend/` folder):

```bash
cd frontend
npm install
npm run dev
# open the URL shown by Vite (typically http://localhost:5173)
```

API summary (core endpoints)
- `POST /api/v1/users/register` — Register. Body example: `{"name":"alice","password":"...","role":"admin"}` (role optional)
- `POST /api/v1/users/login` — Login. Body: `{"name":"alice","password":"..."}`
- `GET /api/v1/users/` and `GET /api/v1/users/{id}` — list / get users
- `POST /api/v1/channels/?user_id={user_id}` — create channel (creator must be `admin`); creator auto-joined
- `GET /api/v1/channels/` and `GET /api/v1/channels/{id}` — list / get channel
- `POST /api/v1/channels/{id}/join?user_id={user_id}` — join a channel
- `GET /api/v1/channels/{id}/members` — list members
- `GET /api/v1/messages/{channel_id}` — channel history
- WebSocket: `ws://<host>/api/v1/ws/channels/{channel_id}/{user_id}` — realtime messaging

Examples

Register a user (curl):

```bash
curl -X POST 'http://localhost:8000/api/v1/users/register' \
  -H 'Content-Type: application/json' \
  -d '{"name":"bob","password":"pass"}'
```

Connect via WebSocket (browser JS):

```js
const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/channels/${channelId}/${userId}`);
ws.onmessage = (e) => { const evt = JSON.parse(e.data); console.log(evt); };
ws.onopen = () => { ws.send('hello'); /* or ws.send(JSON.stringify({content:'hello'})) */ };
```

Notes & security
- There is no token-based authentication yet — endpoints accept `user_id` where required. This is a development/demo setup.
- Passwords are encrypted with Fernet for development; use proper hashing (bcrypt/argon2) for production.
- Add migrations (Alembic) and move to PostgreSQL for production deployments.

Tests
- `backend/test_integration.py` is a simple integration script to exercise core flows. Start the backend first, then run the script from `backend/`.

Next steps (suggested)
- Add JWT-based auth and secure endpoints
- Add migrations and Postgres support
- Scaffold the frontend UI components and a minimal light theme

If you want, I can scaffold the frontend now and wire a WebSocket client to the backend.
# ChatWebApp

Lightweight Slack-like chat application (backend + frontend). This repository contains a FastAPI backend (with REST + WebSocket) and a React/Vite frontend scaffold. The backend ships a small SQLite development DB by default and is structured to be migrated to PostgreSQL for production.

**Quick links**
- Backend: `backend/`
- Frontend: `frontend/`

**Highlights**
- REST API for users, channels and messages
- WebSocket realtime channel messaging with presence (join/leave events)
- Simple role model (`admin` / `user`) and admin-only channel creation
- Messages are persisted to the database when sent over WebSocket
- Small, minimal light-theme frontend scaffold (Vite + React)

## What I implemented
- App factory in `backend/app.py` with versioned API routers under `/api/v1`
- Models in `backend/models.py`: `User`, `Channel`, `ChannelMember`, `Message`
- Pydantic schemas in `backend/schemas.py`
- Password encryption helpers in `backend/crypto.py` (Fernet — development use only)
- REST endpoints in `backend/api/v1/`:
  - `users.py` — register, login, get user, list users
  - `channels.py` — create (admin), list, get, join, members
  - `messages.py` — send/get history
  - `ws.py` — WebSocket channel handler (realtime)
- WebSocket realtime path: `/api/v1/ws/channels/{channel_id}/{user_id}` — accepts raw text or JSON (`{"content":"..."}`)

## Quickstart (development)
These commands assume Windows PowerShell (your default).

1) Backend: activate venv (already present in `backend/.venv` in this workspace):

```powershell
Set-Location 'C:\Users\karti\OneDrive\Documents\GitHub\ChatWebApp'
. backend\.venv\Scripts\Activate.ps1
```

2) Initialize the database and verify imports:

```powershell
python -c "from backend.app import app; from backend.database import init_db; init_db(); print('√ App initialized'); print(f'√ Routes: {len(app.routes)}')"
```

3) Start the backend server:

```powershell
# For stable runs set reload off; backend/main.py handles reload logic
python backend/main.py --host 127.0.0.1 --port 8000
```

4) Frontend (in `frontend/`):

```powershell
Set-Location '<your dir>\ChatWebApp\frontend'
npm install
npm run dev
# open the URL shown by Vite (typically http://localhost:5173)
```

## Environment
- Database: backend reads `DATABASE_URL` from `backend/.env` (default `sqlite:///./test.db` in dev)
- To switch to Postgres for production, update `DATABASE_URL` accordingly and run migrations (not included yet).

## API Summary
- `POST /api/v1/users/register` — Register. Body: `{"name":"alice","password":"...","role":"admin"}` (role may be provided in body)
- `POST /api/v1/users/login` — Login. Body: `{"name":"alice","password":"..."}`
- `GET /api/v1/users/` and `GET /api/v1/users/{id}` — list / get users
- `POST /api/v1/channels/?user_id={user_id}` — create channel (creator must be `admin`), creator auto-joined
- `GET /api/v1/channels/` and `GET /api/v1/channels/{id}` — list / get
- `POST /api/v1/channels/{id}/join?user_id={user_id}` — join a channel
- `GET /api/v1/channels/{id}/members` — list members
- `GET /api/v1/messages/{channel_id}` — channel history
- WebSocket: `ws://<host>/api/v1/ws/channels/{channel_id}/{user_id}` — realtime messaging

Notes:
- There is no token-based authentication yet; endpoints expect `user_id` where required. Treat this as a dev/demo environment.
- Messages sent over WebSocket are persisted to the database and broadcast to other channel members.

## Tests
- A simple integration test exists at `backend/test_integration.py`. To run it (after starting the backend):

```powershell
Set-Location '<your dir>\ChatWebApp\backend'
. .\.venv\Scripts\Activate.ps1
python test_integration.py
```

## Security & Production notes
- Passwords are encrypted using Fernet in `backend/crypto.py` for development — implement proper password hashing (bcrypt/argon2) for production and manage secrets securely.
- Add JWT or session-based auth before deploying publicly.
- Add DB migrations (Alembic) and switch to PostgreSQL for production.

## Next steps / TODO
- Add token-based authentication (JWT)
- Add migrations and Postgres setup
- Add frontend features: settings page persisted to backend, better message pagination, typing indicators

## Author / Credits
This project was refactored and rebuilt into a Slack-like app with versioned API, WebSocket messaging, and a minimal React frontend scaffold.

If you'd like, I can scaffold the frontend components, wire the WebSocket client, and add a small design theme next.
# ChatWebApp
Full-stack chat app using FastAPI, React, PostgreSQL
