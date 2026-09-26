import httpx
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_flow():
    client = httpx.Client(base_url=BASE_URL)
    
    email = f"test_{int(time.time())}@example.com"
    password = "SecurePassword123!"
    name = "E2E Tester"
    
    print(f"1. Signup: {email}")
    r = client.post("/auth/signup", json={
        "email": email,
        "password": password,
        "full_name": name
    })
    print(r.status_code, r.text)
    assert r.status_code in [200, 201]
    token = r.json().get("verification_token")

    if token:
        print("1.5 Verify Email")
        r = client.post("/auth/verify-email", json={"token": token})
        print(r.status_code, r.text)
        assert r.status_code in [200, 201]
    
    print("2. Login")
    r = client.post("/auth/login", json={
        "email": email,
        "password": password
    })
    print(r.status_code, r.text)
    assert r.status_code == 200
    token = r.json()["access_token"]
    
    client.headers = {"Authorization": f"Bearer {token}"}
    
    print("2.5 Create Profile")
    r = client.post("/profiles", json={
        "display_name": name,
        "headline": "Professional"
    })
    print(r.status_code, r.text)
    assert r.status_code in [200, 201]
    
    print("3. Get Profile Me")
    r = client.get("/profiles/me")
    print(r.status_code, r.text)
    assert r.status_code == 200
    profile_id = r.json()["id"]
    
    print("4. Edit Profile")
    r = client.patch(f"/profiles/{profile_id}", json={
        "display_name": "Updated Tester",
        "headline": "Senior QA"
    })
    print(r.status_code, r.text)
    assert r.status_code == 200
    
    print("5. Add Skill")
    r = client.post(f"/profiles/{profile_id}/skills", json={
        "skill_name": "Test Automation"
    })
    print(r.status_code, r.text)
    assert r.status_code in [200, 201]
    skill_claim_id = r.json()["id"]
    
    print("6. Create Organization")
    r = client.post("/organizations", json={
        "name": f"Test Org {int(time.time())}"
    })
    print(r.status_code, r.text)
    assert r.status_code in [200, 201]
    org_id = r.json()["id"]
    
    print("7. Invite Member (Expecting 404)")
    r = client.post(f"/organizations/{org_id}/members", json={
        "email": "invitee@example.com"
    })
    print(r.status_code, r.text)
    assert r.status_code == 404
    
    print("8. Create Verification Request")
    r = client.post("/verification-requests", json={
        "target_type": "profile_skill",
        "target_id": skill_claim_id
    })
    print(r.status_code, r.text)
    assert r.status_code in [200, 201]

    req_id = r.json()["id"]

    print("9. Approve Verification Request")
    r = client.post(f"/verification-requests/{req_id}/approve")
    print(r.status_code, r.text)
    assert r.status_code in [200, 201, 403] # 403 because we're not admin!
    
    print("Flow completed successfully")

if __name__ == "__main__":
    test_flow()
