import os
import re
import shutil
import signal
import subprocess
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import asyncio

# Configuration
ACESTREAM_BASE_URL = os.getenv("ACESTREAM_BASE_URL", "http://localhost:6878")
STORAGE_DIR = Path(os.getenv("STORAGE_DIR", "storage"))
HLS_ROOT = STORAGE_DIR / "hls"
HLS_ROUTE = "/hls"
HLS_PUBLIC_BASE = os.getenv("HLS_PUBLIC_BASE", "")  # ex: https://cdn.exemple.com/hls

STORAGE_DIR.mkdir(parents=True, exist_ok=True)
HLS_ROOT.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="AceStream → HLS", version="0.1.0")

# CORS minimal pour POC
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir les segments HLS en statique (POC)
app.mount(HLS_ROUTE, StaticFiles(directory=str(HLS_ROOT)), name="hls")


class StartRequest(BaseModel):
    hash: str
    ttlSeconds: int = 7200
    videoQuality: Optional[str] = None  # futur: map à -vf/-b:v

class StreamInfo(BaseModel):
    sessionId: str
    hlsUrl: str
    startedAt: float
    ttlSeconds: int
    running: bool

# Mémoire POC (en prod: Redis/DB)
sessions: Dict[str, Dict] = {}

# Cache des playlists M3U
m3u_cache: Dict[str, List[Dict]] = {}


def acestream_input_url(hash_id: str) -> str:
    return f"{ACESTREAM_BASE_URL}/ace/getstream?id={hash_id}"


def build_hls_command(input_url: str, out_dir: Path) -> subprocess.Popen:
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = out_dir / "index.m3u8"
    # FFmpeg HLS basique, segment 4s, petite fenêtre, supprime segments anciens
    cmd = [
        "ffmpeg",
        "-hide_banner", "-loglevel", "warning",
        "-reconnect", "1", "-reconnect_streamed", "1", "-reconnect_delay_max", "30",
        "-i", input_url,
        "-c:v", "copy",
        "-c:a", "aac", "-ac", "2", "-ar", "48000", "-b:a", "128k",
        "-f", "hls",
        "-hls_time", "4",
        "-hls_list_size", "6",
        "-hls_flags", "delete_segments+independent_segments",
        str(manifest)
    ]
    return subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


@app.post("/api/streams", response_model=StreamInfo)
def start_stream(req: StartRequest):
    if not req.hash or len(req.hash) < 32:
        raise HTTPException(status_code=400, detail="hash invalide")

    session_id = uuid.uuid4().hex
    out_dir = HLS_ROOT / session_id
    input_url = acestream_input_url(req.hash)

    proc = build_hls_command(input_url, out_dir)
    started_at = time.time()

    # URL publique du manifest
    if HLS_PUBLIC_BASE:
        hls_url = f"{HLS_PUBLIC_BASE.rstrip('/')}/{session_id}/index.m3u8"
    else:
        hls_url = f"{HLS_ROUTE}/{session_id}/index.m3u8"

    sessions[session_id] = {
        "pid": proc.pid,
        "startedAt": started_at,
        "ttl": req.ttlSeconds,
        "outDir": str(out_dir),
        "hash": req.hash,
    }

    return StreamInfo(
        sessionId=session_id,
        hlsUrl=hls_url,
        startedAt=started_at,
        ttlSeconds=req.ttlSeconds,
        running=True,
    )


@app.get("/api/streams/{session_id}", response_model=StreamInfo)
def get_status(session_id: str):
    s = sessions.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="session inconnue")
    pid = s.get("pid")
    running = False
    if pid:
        try:
            os.kill(pid, 0)
            running = True
        except Exception:
            running = False
    hls_url = f"{HLS_PUBLIC_BASE.rstrip('/')}/{session_id}/index.m3u8" if HLS_PUBLIC_BASE else f"{HLS_ROUTE}/{session_id}/index.m3u8"
    return StreamInfo(
        sessionId=session_id,
        hlsUrl=hls_url,
        startedAt=s["startedAt"],
        ttlSeconds=s["ttl"],
        running=running,
    )


@app.delete("/api/streams/{session_id}")
def stop_stream(session_id: str):
    s = sessions.pop(session_id, None)
    if not s:
        raise HTTPException(status_code=404, detail="session inconnue")
    pid = s.get("pid")
    if pid:
        try:
            os.kill(pid, signal.SIGTERM)
        except Exception:
            pass
    out_dir = Path(s.get("outDir", ""))
    if out_dir.exists():
        shutil.rmtree(out_dir, ignore_errors=True)
    return {"stopped": True}


# ============ M3U PARSER & PLAYLIST API ============

def parse_m3u_content(content: str) -> List[Dict]:
    """Parse M3U content and extract AceStream links"""
    channels = []
    lines = content.strip().split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if line.startswith('#EXTINF'):
            # Extract channel info from EXTINF line
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
            
            # Extract channel name (after last comma)
            name_match = re.search(r',(.+)$', line)
            if name_match:
                channel_info['name'] = name_match.group(1).strip()
            
            # Get next line (stream URL)
            i += 1
            if i < len(lines):
                url = lines[i].strip()
                
                # Extract AceStream hash from different URL formats
                acestream_hash = None
                
                # Format 1: http://127.0.0.1:6878/ace/getstream?id=HASH
                if 'ace/getstream?id=' in url:
                    acestream_hash = url.split('id=')[-1]
                
                # Format 2: acestream://HASH
                elif url.startswith('acestream://'):
                    acestream_hash = url.replace('acestream://', '')
                
                # Format 3: https://acestream.me/embed/HASH
                elif 'acestream.me/embed/' in url:
                    acestream_hash = url.split('/embed/')[-1]
                
                if acestream_hash:
                    channel_info['acestream_hash'] = acestream_hash
                    channel_info['original_url'] = url
                    channels.append(channel_info)
        
        i += 1
    
    return channels


@app.get("/api/playlists")
def list_playlists():
    """List available M3U playlists"""
    m3u_files = []
    
    # Search for M3U files in root directory
    for file in Path('.').glob('*.m3u'):
        m3u_files.append({
            'name': file.name,
            'path': str(file)
        })
    
    return {"playlists": m3u_files}


@app.get("/api/playlists/{playlist_name}/channels")
def get_playlist_channels(playlist_name: str):
    """Get channels from a specific M3U playlist"""
    
    # Check cache first
    if playlist_name in m3u_cache:
        return {"channels": m3u_cache[playlist_name], "cached": True}
    
    # Try to find the playlist file
    playlist_path = Path(playlist_name)
    
    if not playlist_path.exists():
        # Try with .m3u extension
        playlist_path = Path(f"{playlist_name}.m3u")
    
    if not playlist_path.exists():
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    try:
        with open(playlist_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        channels = parse_m3u_content(content)
        
        # Cache the result
        m3u_cache[playlist_name] = channels
        
        return {"channels": channels, "cached": False, "total": len(channels)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing playlist: {str(e)}")


@app.post("/api/play")
def play_acestream_channel(request: dict):
    """
    Start streaming an AceStream channel
    Request body: {"hash": "acestream_hash"}
    Returns: {"session_id": "...", "hls_url": "..."}
    """
    acestream_hash = request.get("hash")
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    # Start HLS stream
    start_req = StartRequest(hash=acestream_hash, ttlSeconds=7200)
    stream_info = start_stream(start_req)
    
    return {
        "session_id": stream_info.sessionId,
        "hls_url": stream_info.hlsUrl,
        "status": "streaming"
    }


@app.get("/")
def root():
    return {
        "service": "AceStream → HLS Proxy",
        "version": "2.0.0",
        "features": [
            "M3U Playlist Parsing",
            "AceStream → HLS Conversion",
            "No Client Installation Required"
        ],
        "endpoints": {
            "playlists": "/api/playlists",
            "channels": "/api/playlists/{name}/channels",
            "play": "/api/play (POST)",
            "streams": "/api/streams (POST)"
        }
    }
