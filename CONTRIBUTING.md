# Contributing

Thanks for your interest in contributing to ChatWebApp. This document contains a short guide to help you get started.

## Code style
- Keep code changes small and focused. Follow the existing project style.
- Python: use 4-space indentation, type hints where useful, concise docstrings.
- JavaScript/React: prefer functional components and hooks; keep components small and reusable.

## Branching & PRs
- Create feature branches from `main`: `feature/short-description` or `fix/short-description`.
- Push branches to your fork and open a Pull Request against `main`.
- In PR description include: what changed, why, and any manual steps required to test.

## Testing
- Backend: run `backend/test_integration.py` after starting the server to exercise core flows.
- Frontend: use `npm run dev` to run locally and simple unit tests (if added).

## Running locally
- Backend:
  1. Activate the provided venv: `. backend/.venv/Scripts/Activate.ps1` (PowerShell)
  2. Initialize DB and run: `python backend/main.py`
- Frontend:
  1. `cd frontend`, `npm install`, `npm run dev`

## Submitting changes
- Keep commits atomic and descriptive.
- Run tests locally before opening a PR.

## Code of Conduct
Be respectful and constructive. Keep comments and reviews focused on code and user value.
