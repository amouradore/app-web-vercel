import requests
import json
import time

print("=" * 70)
print("TEST INTEGRATION COMPLETE - Backend avec HLS Conversion")
print("=" * 70)

# Attendre un peu que Render redéploie
print("\nAttente de 5 secondes pour le déploiement Render...")
time.sleep(5)

# Test 1: Version du backend
print("\n[TEST 1] Version du backend")
print("-" * 70)
try:
    response = requests.get("https://app-web-vercel.onrender.com/", timeout=10)
    data = response.json()
    print(f"Version: {data.get('version', 'N/A')}")
    print(f"Status: {data.get('status', 'N/A')}")
    print(f"Features: {', '.join(data.get('features', []))}")
except Exception as e:
    print(f"ERROR: {e}")

# Test 2: API /api/play
print("\n[TEST 2] API /api/play")
print("-" * 70)
try:
    url = "https://app-web-vercel.onrender.com/api/play"
    payload = {"hash": "eb6ffec065b26259ad3d1811e0bbb0a5332ed276"}
    response = requests.post(url, json=payload, timeout=15)
    
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print("\nResponse:")
    print(json.dumps(data, indent=2))
    
    if response.status_code == 200:
        print(f"\nOK - Type: {data.get('type')}")
        print(f"OK - Backend: {data.get('backend')}")
        print(f"OK - Stream URL: {data.get('stream_url')}")
        
        # Vérifier si c'est HLS
        if 'playlist.m3u8' in data.get('stream_url', ''):
            print("\nSUCCES: Conversion HLS activee!")
        else:
            print("\nWARNING: Pas de conversion HLS detectee")
    else:
        print(f"\nERROR: Status code {response.status_code}")
        
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "=" * 70)
print("Fin des tests API")
print("=" * 70)
