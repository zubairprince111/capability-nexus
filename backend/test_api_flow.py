import string
import random
from fastapi.testclient import TestClient
from app.main import app

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def main():
    with TestClient(app) as client:
        # 1. Try to signup a new user
        email = f"test_{random_string()}@example.com"
        pwd = "Password123!"
        print(f"Creating user {email}")
        res = client.post("/api/v1/auth/signup", json={"email": email, "password": pwd, "full_name": "Test User"})
        print("Signup:", res.status_code)
        if res.status_code >= 500:
            print("ERROR IN SIGNUP:", res.text)
            return

        if res.status_code == 201:
            token = res.json()["verification_token"]
            # Verify email
            res = client.post("/api/v1/auth/verify-email", json={"token": token})
            print("Verify:", res.status_code)

        # Login
        res = client.post("/api/v1/auth/login", json={"email": email, "password": pwd})
        print("Login:", res.status_code)
        if res.status_code != 200:
            print("Login failed", res.text)
            return
        
        access_token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Test /auth/me
        res = client.get("/api/v1/auth/me", headers=headers)
        print("/auth/me:", res.status_code)
        if res.status_code >= 500:
            print("ERROR IN /auth/me:", res.text)

        # 3. Create a profile (since /profiles/me will return 404 until created)
        profile_payload = {
            "display_name": "Test User",
            "headline": "Expert Backend Developer",
            "job_roles": ["Software Engineer"],
            "portfolio_links": [{"label": "GitHub", "url": "https://github.com"}],
            "visibility": "public"
        }
        res = client.post("/api/v1/profiles", json=profile_payload, headers=headers)
        print("Create Profile:", res.status_code)
        if res.status_code >= 500:
            print("ERROR IN Create Profile:", res.text)
            return
            
        profile_id = res.json()["id"]

        # Test /profiles/me again
        res = client.get("/api/v1/profiles/me", headers=headers)
        print("/profiles/me:", res.status_code)
        if res.status_code >= 500:
            print("ERROR IN /profiles/me:", res.text)
            return

        # 4. Create a service on the profile
        service_payload = {
            "title": "API Development",
            "description": "High performance API development",
            "rate_type": "hourly",
            "rate_amount": 100,
            "availability_status": "available"
        }
        res = client.post(f"/api/v1/profiles/{profile_id}/services", json=service_payload, headers=headers)
        print("Create Service:", res.status_code)
        if res.status_code >= 500:
            print("ERROR IN Create Service:", res.text)
            return
            
        # 5. List services
        res = client.get(f"/api/v1/profiles/{profile_id}/services", headers=headers)
        print("List Services:", res.status_code)
        print("Flow completed successfully!")

if __name__ == "__main__":
    import logging
    logging.basicConfig(level=logging.ERROR)
    main()
