"""Password encryption and verification using AES."""

from cryptography.fernet import Fernet
import os
import base64


# Generate a simple fixed key for development (in production, use env var or key management service)
_KEY = os.getenv("ENCRYPTION_KEY", "default-dev-key-change-in-production")
# Pad or hash the key to 32 bytes for Fernet
_KEY_BYTES = base64.urlsafe_b64encode((_KEY * 4)[:32].encode()).decode()
_CIPHER = Fernet(_KEY_BYTES)


def encrypt_password(password: str) -> str:
    """Encrypt password using AES (Fernet)."""
    encrypted = _CIPHER.encrypt(password.encode())
    return encrypted.decode()


def verify_password(encrypted_password: str, plaintext: str) -> bool:
    """Verify plaintext password against encrypted stored password."""
    try:
        decrypted = _CIPHER.decrypt(encrypted_password.encode()).decode()
        return decrypted == plaintext
    except Exception:
        return False
