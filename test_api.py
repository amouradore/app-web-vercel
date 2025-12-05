import requests
import json

url = "http://127.0.0.1:8000/api/play"
payload = {"hash": "eb6ffec065b26259ad3d1811e0bbb0a5332ed276"}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
