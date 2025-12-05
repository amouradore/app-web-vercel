import requests
import json

# Test 1: Backend API /api/play
url = "https://app-web-vercel.onrender.com/api/play"
payload = {"hash": "eb6ffec065b26259ad3d1811e0bbb0a5332ed276"}

print("=" * 60)
print("TEST 1: Backend API /api/play")
print("=" * 60)
try:
    response = requests.post(url, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print("\nResponse JSON:")
    data = response.json()
    print(json.dumps(data, indent=2))
    
    if "stream_url" in data:
    print(f"\nOK Stream URL: {data['stream_url']}")
        print(f"OK Type: {data.get('type', 'N/A')}")
        print(f"OK Backend: {data.get('backend', 'N/A')}")
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "=" * 60)
print("TEST 2: Railway AceStream Server")
print("=" * 60)
try:
    railway_url = "https://acestream-server-production.up.railway.app/webui/api/service?method=get_version"
    print(f"Testing: {railway_url}")
    response = requests.get(railway_url, timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"❌ Error: {e}")
