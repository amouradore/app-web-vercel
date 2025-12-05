import requests
import json

url = "https://app-web-vercel.onrender.com/api/play"
payload = {"hash": "eb6ffec065b26259ad3d1811e0bbb0a5332ed276"}

try:
    print(f"Testing {url}...")
    response = requests.post(url, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
