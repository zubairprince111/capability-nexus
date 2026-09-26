from fastapi.testclient import TestClient
from app.main import app

def main():
    with TestClient(app) as client:
        response = client.get("/api/v1/auth/me")
        print("GET /auth/me ->", response.status_code, response.text)

if __name__ == "__main__":
    main()
