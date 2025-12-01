# Contributing to ChatWebApp

Thank you for your interest in contributing to ChatWebApp! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code of Conduct](#code-of-conduct)

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ChatWebApp.git
   cd ChatWebApp
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/kartikey071999/ChatWebApp.git
   ```

## 💻 Development Setup

### Backend Setup
```bash
# Activate virtual environment
backend\.venv\Scripts\Activate.ps1  # Windows
# source backend/.venv/bin/activate  # Linux/Mac

# Install dependencies
cd backend
pip install -r requirements.txt

# Initialize database
cd ..
python -c "from backend.database import init_db; init_db()"

# Run backend
python backend/main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Verify Setup
- Backend: http://127.0.0.1:8000/docs
- Frontend: http://localhost:8080

## 📝 Code Standards

### Python (Backend)

- **Style**: Follow PEP 8
- **Indentation**: 4 spaces
- **Type Hints**: Use type hints for function parameters and return values
- **Docstrings**: Use triple-quoted docstrings for modules, classes, and functions
- **Imports**: Group imports (standard library, third-party, local)

**Example:**
```python
from typing import List
from fastapi import APIRouter, HTTPException
from ..models import User

def get_user(user_id: str) -> User:
    """Retrieve a user by ID.
    
    Args:
        user_id: The unique identifier of the user
        
    Returns:
        User object if found
        
    Raises:
        HTTPException: If user not found
    """
    pass
```

### TypeScript/React (Frontend)

- **Style**: Use ESLint configuration
- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks in `src/hooks/`
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Props**: Define explicit TypeScript interfaces

**Example:**
```typescript
interface MessageProps {
  content: string;
  senderId: string;
  timestamp: string;
}

export const Message: React.FC<MessageProps> = ({ content, senderId, timestamp }) => {
  return (
    <div className="message">
      {/* component logic */}
    </div>
  );
};
```

### General Principles

- **Keep changes focused**: One feature/fix per PR
- **Write clear commit messages**: Use conventional commits format
- **Comment complex logic**: Explain "why", not "what"
- **Avoid code duplication**: Extract reusable functions
- **Error handling**: Always handle errors gracefully

## 🔨 Making Changes

### Creating a Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# OR
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-direct-messages`)
- `fix/` - Bug fixes (e.g., `fix/websocket-reconnect`)
- `docs/` - Documentation updates (e.g., `docs/update-api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-logic`)
- `test/` - Test additions (e.g., `test/channel-api`)

### Commit Message Format

Use conventional commits:

```
type(scope): brief description

Longer description if needed

Fixes #issue-number
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(backend): add JWT authentication
fix(frontend): resolve WebSocket reconnection loop
docs(readme): update installation instructions
refactor(api): simplify channel creation logic
```

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
python test_integration.py
```

### Manual Testing Checklist

Before submitting a PR, verify:
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] User registration works
- [ ] Login works
- [ ] Channel creation works
- [ ] Real-time messaging works
- [ ] WebSocket stays connected (no rapid reconnects)
- [ ] Multiple users can chat simultaneously
- [ ] No console errors in browser
- [ ] Code follows style guidelines

### Writing Tests

When adding new features, include tests:
- Backend: Add test cases to `test_integration.py` or create new test files
- Frontend: Add component tests (if test framework is added)

## 📤 Submitting Changes

### Pull Request Process

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(component): add feature description"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** on GitHub:
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #issue-number
```

### Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged
- Your contribution will be credited

## 🤝 Code of Conduct

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be constructive**: Provide helpful feedback
- **Be patient**: Not everyone has the same experience level
- **Be collaborative**: Work together toward the best solution
- **Focus on the code**: Keep discussions technical and objective

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Personal attacks or political discussions
- Publishing others' private information
- Any conduct inappropriate in a professional setting

### Reporting Issues

If you experience or witness unacceptable behavior, report it by contacting the project maintainers.

## 💡 Areas for Contribution

Looking for ideas? Here are areas that need work:

### High Priority
- JWT authentication implementation
- Database migrations (Alembic)
- PostgreSQL configuration
- Comprehensive test suite

### Medium Priority
- Message pagination
- Typing indicators
- User profile editing
- Direct messages (DMs)
- File/image upload

### Nice to Have
- Dark mode
- Message search
- Channel notifications
- Message threading
- Emoji reactions

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## ❓ Questions?

- Open an issue for bug reports or feature requests
- Check existing issues before creating new ones
- Tag your issues appropriately (`bug`, `enhancement`, `question`, etc.)

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ChatWebApp! 🎉
