import requests
import json
import time

BASE_URL = "https://app-web-vercel.onrender.com"
HASH = "eb6ffec065b26259ad3d1811e0bbb0a5332ed276" # Canal 1 or similar

print(f"Testing HLS Debug against {BASE_URL}")

# 1. Get the stream URL from /api/play
print("\n1. Requesting /api/play...")
try:
    resp = requests.post(f"{BASE_URL}/api/play", json={"hash": HASH})
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(json.dumps(data, indent=2))
    
    stream_url = data.get("stream_url")
    if not stream_url:
        print("FAIL No stream_url found!")
        exit(1)
        
    print(f"\nTarget Stream URL: {stream_url}")
    
    # 2. Fetch the playlist
    print("\n2. Fetching playlist content...")
    # If the URL is relative, make it absolute (though we expect absolute now)
    if stream_url.startswith("/"):
        stream_url = f"{BASE_URL}{stream_url}"
        
    playlist_resp = requests.get(stream_url)
    print(f"Playlist Status: {playlist_resp.status_code}")
    print(f"Content-Type: {playlist_resp.headers.get('Content-Type')}")
    print("\n--- RESPONSE CONTENT START ---")
    print(playlist_resp.text)
    print("--- RESPONSE CONTENT END ---")
    
    if playlist_resp.status_code != 200:
        print("\nFAIL Playlist request failed!")
    elif "#EXTM3U" not in playlist_resp.text:
        print("\nFAIL Response is NOT a valid M3U8 playlist!")
    else:
        print("\nSUCCESS Valid M3U8 playlist received!")

except Exception as e:
    print(f"\nFAIL Exception: {e}")
