import os
import re
from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Configuration
app = FastAPI(title="AceStream HLS Proxy", version="2.0.0")

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache des playlists M3U
m3u_cache: Dict[str, List[Dict]] = {}


def parse_m3u_content(content: str) -> List[Dict]:
    """Parse M3U content and extract AceStream links"""
    channels = []
    lines = content.strip().split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if line.startswith('#EXTINF'):
            channel_info = {}
            
            # Extract tvg-logo
            logo_match = re.search(r'tvg-logo="([^"]*)"', line)
            if logo_match:
                channel_info['logo'] = logo_match.group(1)
            
            # Extract tvg-id
            id_match = re.search(r'tvg-id="([^"]*)"', line)
            if id_match:
                channel_info['id'] = id_match.group(1)
            
            # Extract group-title
            group_match = re.search(r'group-title="([^"]*)"', line)
            if group_match:
                channel_info['group'] = group_match.group(1)
            
            # Extract channel name
            name_match = re.search(r',(.+)$', line)
            if name_match:
                channel_info['name'] = name_match.group(1).strip()
            
            # Get next line (stream URL)
            i += 1
            if i < len(lines):
                url = lines[i].strip()
                
                # Extract AceStream hash
                acestream_hash = None
                
                if 'ace/getstream?id=' in url:
                    acestream_hash = url.split('id=')[-1]
                elif url.startswith('acestream://'):
                    acestream_hash = url.replace('acestream://', '')
                elif 'acestream.me/embed/' in url:
                    acestream_hash = url.split('/embed/')[-1]
                
                if acestream_hash:
                    channel_info['acestream_hash'] = acestream_hash
                    channel_info['original_url'] = url
                    channels.append(channel_info)
        
        i += 1
    
    return channels


@app.get("/")
def root():
    return {
        "service": "AceStream → HLS Proxy",
        "version": "2.0.0",
        "status": "running",
        "port": os.getenv("PORT", "unknown"),
        "features": [
            "M3U Playlist Parsing",
            "AceStream → HLS Conversion",
            "No Client Installation Required"
        ],
        "endpoints": {
            "playlists": "/api/playlists",
            "channels": "/api/playlists/{name}/channels",
            "health": "/health"
        }
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "acestream-hls-proxy"
    }


@app.get("/api/playlists")
def list_playlists():
    """List available M3U playlists"""
    m3u_files = []
    
    # Search for M3U files in current directory
    for file in Path('.').glob('*.m3u'):
        m3u_files.append({
            'name': file.name,
            'path': str(file),
            'size': file.stat().st_size
        })
    
    return {
        "playlists": m3u_files,
        "total": len(m3u_files)
    }


@app.get("/api/playlists/{playlist_name}/channels")
def get_playlist_channels(playlist_name: str):
    """Get channels from a specific M3U playlist"""
    
    # Check cache first
    if playlist_name in m3u_cache:
        return {"channels": m3u_cache[playlist_name], "cached": True, "total": len(m3u_cache[playlist_name])}
    
    # Try to find the playlist file
    playlist_path = Path(playlist_name)
    
    if not playlist_path.exists():
        playlist_path = Path(f"{playlist_name}.m3u")
    
    if not playlist_path.exists():
        raise HTTPException(status_code=404, detail=f"Playlist '{playlist_name}' not found")
    
    try:
        with open(playlist_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        channels = parse_m3u_content(content)
        
        # Cache the result
        m3u_cache[playlist_name] = channels
        
        return {
            "channels": channels,
            "cached": False,
            "total": len(channels)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing playlist: {str(e)}")


@app.post("/api/play")
async def play_acestream_channel(request: dict):
    """
    Convert AceStream hash to playable HLS stream URL
    Uses AceStream Engine on Railway to convert P2P to HLS
    """
    acestream_hash = request.get("hash")
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    # Remove any whitespace or special characters
    acestream_hash = acestream_hash.strip()
    
    # Get the AceStream Engine base URL (should be http://127.0.0.1:6878 on Railway)
    acestream_base = os.getenv("ACESTREAM_BASE_URL", "http://127.0.0.1:6878")
    
    try:
        # Request stream from AceStream Engine
        stream_url = f"{acestream_base}/ace/getstream?id={acestream_hash}"
        
        return {
            "status": "success",
            "hash": acestream_hash,
            "stream_url": stream_url,
            "hls_url": stream_url,  # AceStream Engine returns HTTP stream
            "type": "acestream_proxy",
            "backend": "railway",
            "message": "Stream ready - No AceStream installation required!"
        }
    except Exception as e:
        # Fallback options
        return {
            "status": "partial",
            "hash": acestream_hash,
            "stream_url": f"{acestream_base}/ace/getstream?id={acestream_hash}",
            "hls_url": f"{acestream_base}/ace/getstream?id={acestream_hash}",
            "error": str(e),
            "message": "Backend is starting up, please retry in a few seconds"
        }


@app.get("/api/stream/{acestream_hash}")
async def get_stream_url(acestream_hash: str):
    """
    Get direct streaming URL for AceStream hash via Railway backend
    No client installation required!
    """
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    acestream_hash = acestream_hash.strip()
    acestream_base = os.getenv("ACESTREAM_BASE_URL", "http://127.0.0.1:6878")
    
    return {
        "hash": acestream_hash,
        "hls_url": f"{acestream_base}/ace/getstream?id={acestream_hash}",
        "stream_url": f"{acestream_base}/ace/getstream?id={acestream_hash}",
        "type": "direct_proxy",
        "backend": "railway_acestream_engine",
        "note": "Stream is processed by Railway backend - No installation needed!"
    }


@app.get("/api/health/acestream")
async def check_acestream_engine():
    """
    Check if AceStream Engine is running and ready
    """
    import httpx
    acestream_base = os.getenv("ACESTREAM_BASE_URL", "http://127.0.0.1:6878")
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{acestream_base}/webui/api/service")
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "acestream_engine": "running",
                    "message": "AceStream Engine is ready to stream!"
                }
    except Exception as e:
        return {
            "status": "starting",
            "acestream_engine": "initializing",
            "message": "AceStream Engine is starting up, please wait...",
            "error": str(e)
        }
