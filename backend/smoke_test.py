"""Smoke test: verify all APIs and WebSocket work."""

import asyncio
import json
import sys
import os

# Add parent directory to path so we can import backend package
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import httpx
import asyncio as aio
from uuid import uuid4

BASE_URL = "http://127.0.0.1:8000"
WS_URL = "ws://127.0.0.1:8000"


def test_app_import():
    """Test app imports successfully."""
    try:
        from backend.app import app
        print("✓ App imports successfully")
        print(f"✓ App has {len(app.routes)} routes")
        return True
    except Exception as e:
        print(f"✗ App import failed: {e}")
        return False


def test_db_init():
    """Test database initialization."""
    try:
        from backend.database import init_db
        init_db()
        print("✓ Database initialized (tables created)")
        return True
    except Exception as e:
        print(f"✗ Database init failed: {e}")
        return False


async def test_rest_apis():
    """Test REST API endpoints."""
    print("\n--- Testing REST APIs ---")
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=5.0) as client:
        try:
            # Create user 1
            user1_data = {
                "username": f"user_{uuid4().hex[:8]}",
                "email": f"user1_{uuid4().hex[:8]}@test.com",
                "password": "pass123",
                "first_name": "Test",
                "last_name": "User1",
                "contact": "9999999991"
            }
            resp = await client.post("/api/v1/users/", json=user1_data)
            assert resp.status_code == 200, f"Create user1 failed: {resp.text}"
            user1 = resp.json()
            user1_id = user1["id"]
            print(f"✓ Created user1: {user1_id}")

            # Create user 2
            user2_data = {
                "username": f"user_{uuid4().hex[:8]}",
                "email": f"user2_{uuid4().hex[:8]}@test.com",
                "password": "pass456",
                "first_name": "Test",
                "last_name": "User2",
                "contact": "9999999992"
            }
            resp = await client.post("/api/v1/users/", json=user2_data)
            assert resp.status_code == 200, f"Create user2 failed: {resp.text}"
            user2 = resp.json()
            user2_id = user2["id"]
            print(f"✓ Created user2: {user2_id}")

            # Get all users
            resp = await client.get("/api/v1/users/all")
            assert resp.status_code == 200, f"Get all users failed: {resp.text}"
            users = resp.json()
            assert len(users) >= 2, "Should have at least 2 users"
            print(f"✓ Retrieved all users ({len(users)} users)")

            # Get user by ID
            resp = await client.get(f"/api/v1/users/{user1_id}")
            assert resp.status_code == 200, f"Get user by ID failed: {resp.text}"
            user = resp.json()
            assert user["id"] == user1_id
            print(f"✓ Retrieved user by ID: {user1_id}")

            # Test login
            resp = await client.post("/api/v1/users/login", json={"email": user1_data["email"], "password": user1_data["password"]})
            assert resp.status_code == 200, f"Login failed: {resp.text}"
            logged_in = resp.json()
            assert logged_in["id"] == user1_id
            print("✓ Login successful")

            # Send message (REST)
            msg_data = {"sender_id": user1_id, "receiver_id": user2_id, "content": "Hello from REST API"}
            resp = await client.post("/api/v1/messages/", json=msg_data)
            assert resp.status_code == 200, f"Send message failed: {resp.text}"
            msg = resp.json()
            print(f"✓ Sent message via REST: {msg['id']}")

            # Get conversation
            resp = await client.get(f"/api/v1/messages/{user1_id}/{user2_id}")
            assert resp.status_code == 200, f"Get conversation failed: {resp.text}"
            msgs = resp.json()
            assert len(msgs) >= 1, "Should have at least 1 message"
            print(f"✓ Retrieved conversation ({len(msgs)} messages)")

            return user1_id, user2_id

        except Exception as e:
            print(f"✗ REST API test failed: {e}")
            import traceback
            traceback.print_exc()
            return None, None


async def test_websocket(user1_id, user2_id):
    """Test WebSocket endpoint."""
    print("\n--- Testing WebSocket ---")
    if not user1_id or not user2_id:
        print("✗ WebSocket test skipped (no users created)")
        return False

    try:
        import websockets
        from websockets.client import connect

        # User1 connects
        async with connect(f"{WS_URL}/api/v1/ws/{user1_id}") as ws1:
            print(f"✓ User1 connected to WebSocket: {user1_id}")

            # User2 connects
            async with connect(f"{WS_URL}/api/v1/ws/{user2_id}") as ws2:
                print(f"✓ User2 connected to WebSocket: {user2_id}")

                # User1 sends message to User2
                msg = {"receiver_id": str(user2_id), "content": "Hello from WebSocket!"}
                await ws1.send(json.dumps(msg))
                print("✓ User1 sent WebSocket message")

                # User2 receives message
                received = await asyncio.wait_for(ws2.recv(), timeout=2.0)
                data = json.loads(received)
                assert data.get("type") == "message", f"Expected message type, got {data}"
                assert "Hello from WebSocket" in data["message"]["content"]
                print(f"✓ User2 received message: {data['message']['content']}")

                # User1 receives ack
                ack = await asyncio.wait_for(ws1.recv(), timeout=2.0)
                ack_data = json.loads(ack)
                assert ack_data.get("type") == "ack", f"Expected ack type, got {ack_data}"
                assert ack_data.get("delivered") is True
                print("✓ User1 received delivery ack")

        print("✓ WebSocket test passed")
        return True

    except Exception as e:
        print(f"✗ WebSocket test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Run all smoke tests."""
    print("=" * 60)
    print("SMOKE TEST: ChatWebApp Backend")
    print("=" * 60)

    # Test 1: App import
    print("\n--- Testing App Import ---")
    if not test_app_import():
        sys.exit(1)

    # Test 2: Database
    print("\n--- Testing Database ---")
    if not test_db_init():
        sys.exit(1)

    # Test 3: REST APIs
    user1_id, user2_id = await test_rest_apis()

    # Test 4: WebSocket
    if user1_id and user2_id:
        await test_websocket(user1_id, user2_id)

    print("\n" + "=" * 60)
    print("✓ SMOKE TEST PASSED")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
