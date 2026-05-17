def test_register_returns_token(client):
    payload = {
        "username": "newuser",
        "password": "password123",
        "confirm_password": "password123",
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert data["token"]


def test_register_duplicate_username_returns_400(client):
    payload = {
        "username": "dupuser",
        "password": "password123",
        "confirm_password": "password123",
    }

    first = client.post("/auth/register", json=payload)
    assert first.status_code == 201

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 400


def test_register_password_mismatch_returns_422(client):
    payload = {
        "username": "mismatchuser",
        "password": "password123",
        "confirm_password": "password456",
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 422
