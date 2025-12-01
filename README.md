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

A modern, real-time chat application with a FastAPI backend and React frontend. Built with WebSocket support for instant messaging, channel-based communication, and user presence tracking.

## 🚀 Features

- **Real-time Messaging**: WebSocket-based instant message delivery
- **Channel Management**: Create and join channels for organized conversations
- **User Presence**: See who's online in each channel
- **Role-Based Access**: Admin and user roles with permission controls
- **Modern UI**: Clean, responsive interface built with React, TypeScript, and shadcn/ui
- **Persistent Storage**: SQLite for development, PostgreSQL-ready for production
- **Type Safety**: Full TypeScript frontend, Python type hints in backend

## 📁 Project Structure

```
ChatWebApp/
├── backend/           # FastAPI backend
│   ├── api/          # API routes (v1)
│   ├── models.py     # SQLAlchemy models
│   ├── schemas.py    # Pydantic schemas
│   └── main.py       # Entry point
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks (WebSocket)
    │   └── contexts/    # Auth context
    └── public/         # Static assets
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **WebSockets**: Real-time bidirectional communication
- **Uvicorn**: ASGI server
- **SQLite/PostgreSQL**: Database (SQLite for dev, PostgreSQL for prod)

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **shadcn/ui**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Custom WebSocket Hook**: Stable real-time connection management

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ with pip
- Node.js 18+ with npm
- Git

### Backend Setup

1. **Navigate to project root and activate virtual environment:**
   ```bash
   cd ChatWebApp
   source backend/.venv/bin/activate  # Linux/Mac
   # OR
   backend\.venv\Scripts\Activate.ps1  # Windows PowerShell
   ```

2. **Install dependencies (if needed):**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. **Configure environment variables:**
   
   Create `backend/.env` file in the backend directory:
   ```env
   # Database Configuration
   DATABASE_URL=sqlite:///./test.db
   
   # For PostgreSQL (production):
   # DATABASE_URL=postgresql://username:password@localhost/chatapp
   
   # Security & Encryption
   ENCRYPTION_KEY=change-this-to-secure-random-key-in-production
   
   # Server Configuration (optional - these are defaults)
   HOST=127.0.0.1
   PORT=8000
   RELOAD=true
   LOG_LEVEL=info
   ```
   
   **Environment Variables Explained:**
   - `DATABASE_URL`: Database connection string (SQLite for dev, PostgreSQL for production)
   - `ENCRYPTION_KEY`: Key used for password encryption (MUST change in production)
   - `HOST`: Server bind address (default: 127.0.0.1)
   - `PORT`: Server port (default: 8000)
   - `RELOAD`: Enable auto-reload on code changes (default: true)
   - `LOG_LEVEL`: Logging level - `debug`, `info`, `warning`, `error` (default: info)
   
   **Generate secure encryption key:**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. **Initialize database:**
   ```bash
   python -c "from backend.database import init_db; init_db(); print('✓ Database initialized')"
   ```

5. **Start the backend server (from ChatWebApp root directory):**
   ```bash
   python backend/main.py
   ```
   
   Or with custom options:
   ```bash
   python backend/main.py --host 127.0.0.1 --port 8000 --log-level debug
   ```
   
   The backend will be available at `http://127.0.0.1:8000`
   - API Docs: `http://127.0.0.1:8000/docs`
   - Health: `http://127.0.0.1:8000/api/v1/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ChatWebApp/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create `frontend/.env` file in the frontend directory:
   ```env
   # Backend API Configuration
   VITE_API_HOST=http://127.0.0.1:8000/api/v1
   ```
   
   **Environment Variables Explained:**
   - `VITE_API_HOST`: Backend API base URL (must include `/api/v1` path)
     - Development: `http://127.0.0.1:8000/api/v1`
     - Production: `https://your-domain.com/api/v1`
   
   **Note:** Vite only exposes variables prefixed with `VITE_` to the client.

4. **Start the development server (must be run from frontend directory):**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:8080`
   
   **Available scripts:**
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run preview` - Preview production build
   - `npm run lint` - Run ESLint

### Quick Start (Both Services)

**Terminal 1 - Backend (run from ChatWebApp root):**
```bash
# Navigate to project root
cd ChatWebApp

# Activate virtual environment (Windows)
backend\.venv\Scripts\Activate.ps1

# Activate virtual environment (Linux/Mac)
# source backend/.venv/bin/activate

# Run backend from root directory
python backend/main.py
```

**Terminal 2 - Frontend (must navigate to frontend folder):**
```bash
# Navigate to frontend directory
cd ChatWebApp/frontend

# Run frontend dev server
npm run dev
```

Open `http://localhost:8080` in your browser and start chatting!

## 📚 API Documentation

### REST Endpoints

#### Users
- `POST /api/v1/users/register` - Register new user
  ```json
  {"name": "alice", "password": "secure123", "role": "user"}
  ```
- `POST /api/v1/users/login` - User login
  ```json
  {"name": "alice", "password": "secure123"}
  ```
- `GET /api/v1/users/` - List all users
- `GET /api/v1/users/{id}` - Get user by ID

#### Channels
- `POST /api/v1/channels/?user_id={user_id}` - Create channel (admin only)
  ```json
  {"name": "general", "description": "General discussion"}
  ```
- `GET /api/v1/channels/` - List all channels
- `GET /api/v1/channels/{id}` - Get channel details
- `POST /api/v1/channels/{id}/join?user_id={user_id}` - Join channel
- `GET /api/v1/channels/{id}/members` - List channel members

#### Messages
- `GET /api/v1/messages/{channel_id}` - Get message history

### WebSocket

**Endpoint:** `ws://127.0.0.1:8000/api/v1/ws/channels/{channel_id}/{user_id}`

**Send message:**
```json
{"content": "Hello, world!"}
```

**Receive events:**
```json
// New message
{"type": "message", "id": "123", "sender_id": "user1", "content": "Hi!", "created_at": "2025-12-02T..."}

// User joined
{"type": "user_joined", "user_id": "user2", "online_users": ["user1", "user2"]}

// User left
{"type": "user_left", "user_id": "user2", "online_users": ["user1"]}
```

### Example Requests

**Register a user:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"bob","password":"pass123","role":"user"}'
```

**WebSocket connection (JavaScript):**
```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/api/v1/ws/channels/channel-id/user-id');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.send(JSON.stringify({content: 'Hello!'}));
```

## 🧪 Testing

### Backend Integration Tests
```bash
cd backend
python test_integration.py
```

The integration test covers:
- User registration and login
- Channel creation and joining
- Message sending via REST API
- WebSocket connection and messaging

### Manual Testing
1. Start both backend and frontend
2. Register a new user (creates admin role for first user)
3. Create a channel
4. Open multiple browser windows to test real-time messaging
5. Check online user presence indicators

## 🔒 Security Notes

⚠️ **Current Implementation - Development Only**
- No token-based authentication (endpoints use `user_id` query params)
- Passwords encrypted with Fernet (not production-grade hashing)
- CORS configured for development (`allow_origins=["*"]`)

**Before Production Deployment:**
- [ ] Implement JWT or session-based authentication
- [ ] Replace Fernet with bcrypt/argon2 for password hashing
- [ ] Configure proper CORS origins
- [ ] Add rate limiting
- [ ] Implement input validation and sanitization
- [ ] Set up HTTPS/WSS
- [ ] Add database migrations (Alembic)
- [ ] Switch to PostgreSQL with proper connection pooling

## 🐛 Troubleshooting

### WebSocket Connection Issues
- **Frequent reconnections**: Fixed! The custom `useWebSocket` hook now uses refs to prevent dependency loops
- **Connection not stable**: Check that both frontend and backend are running on correct ports
- **CORS errors**: Verify backend CORS settings in `backend/app.py`

### Frontend Not Loading
- Clear browser cache (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- Check console for errors
- Verify API endpoint in browser dev tools Network tab

### Backend Database Issues
- Delete `backend/test.db` and re-initialize: `python -c "from backend.database import init_db; init_db()"`
- Check `backend/.env` for correct `DATABASE_URL`

## 📝 Development Notes

### Environment Files

Both backend and frontend require separate `.env` files for configuration.

#### Backend Environment (`backend/.env`)

Create this file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=sqlite:///./test.db

# Security & Encryption
ENCRYPTION_KEY=change-this-to-secure-random-key-in-production

# Server Configuration (optional)
HOST=127.0.0.1
PORT=8000
RELOAD=true
LOG_LEVEL=info
```

**Variables:**
- `DATABASE_URL` (required): Database connection string
  - SQLite: `sqlite:///./test.db`
  - PostgreSQL: `postgresql://user:password@localhost/dbname`
- `ENCRYPTION_KEY` (required): Encryption key for password storage
  - Development: Any string (e.g., `dev-key-12345`)
  - **Production**: Use a secure random key (see below)
- `HOST` (optional): Server bind address (default: 127.0.0.1)
- `PORT` (optional): Server port (default: 8000)
- `RELOAD` (optional): Auto-reload on code changes (default: true)
- `LOG_LEVEL` (optional): Logging verbosity (default: info)

**Generate a secure encryption key for production:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### Frontend Environment (`frontend/.env`)

Create this file in the `frontend/` directory:

```env
# Backend API Configuration
VITE_API_HOST=http://127.0.0.1:8000/api/v1
```

**Variables:**
- `VITE_API_HOST` (required): Full URL to backend API including `/api/v1`
  - Local: `http://127.0.0.1:8000/api/v1`
  - Production: `https://api.yourdomain.com/api/v1`

**Important Notes:**
- Both `.env` files are gitignored for security
- Frontend variables must be prefixed with `VITE_` to be exposed to the client
- After changing `.env` files, restart the respective server
- Use `.env.example` files as templates

### Code Structure
- **Backend**: Follows FastAPI best practices with versioned APIs (`/api/v1`)
- **Frontend**: Component-based architecture with custom hooks
- **WebSocket**: Stable connection management with exponential backoff retry

## 🚀 Roadmap

- [ ] JWT authentication
- [ ] Database migrations (Alembic)
- [ ] PostgreSQL support
- [ ] Message pagination
- [ ] Typing indicators
- [ ] File/image uploads
- [ ] User profiles and settings
- [ ] Direct messages (DMs)
- [ ] Channel search
- [ ] Message reactions and threading
- [ ] Dark mode toggle
- [ ] Push notifications

## 📄 License

This project is open source and available for educational and development purposes.

## 👥 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

---

**Built with ❤️ using FastAPI, React, and WebSockets**
This project was refactored and rebuilt into a Slack-like app with versioned API, WebSocket messaging, and a minimal React frontend scaffold.

If you'd like, I can scaffold the frontend components, wire the WebSocket client, and add a small design theme next.
# ChatWebApp
Full-stack chat app using FastAPI, React, PostgreSQL
