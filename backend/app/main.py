import os
import re
import asyncio
from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Configuration
app = FastAPI(title="AceStream HLS Proxy", version="2.1.0")

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet tous les domaines (Vercel, etc.)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Inclure OPTIONS pour preflight
    allow_headers=["*"],
    expose_headers=["*"],  # Expose tous les headers
    max_age=3600,  # Cache preflight requests pour 1 heure
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
        "version": "2.1.0",
        "status": "running",
        "port": os.getenv("PORT", "unknown"),
        "features": [
            "M3U Playlist Parsing",
            "AceStream → HTTP Streaming via Proxy",
            "No Client Installation Required",
            "Public streaming via Railway proxy endpoint"
        ],
        "endpoints": {
            "playlists": "/api/playlists",
            "channels": "/api/playlists/{name}/channels",
            "play": "/api/play (POST)",
            "stream_proxy": "/api/stream/{hash} (GET)",
            "health": "/api/health/acestream"
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
    Convert AceStream hash to playable HLS stream via Railway
    Returns HLS playlist URL for browser-compatible streaming
    """
    acestream_hash = request.get("hash")
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    # Remove any whitespace or special characters
    acestream_hash = acestream_hash.strip()
    
    # Return HLS playlist URL (FFmpeg will convert MPEG-TS to HLS)
    hls_playlist_url = f"/api/stream/{acestream_hash}/playlist.m3u8"
    
    return {
        "status": "success",
        "hash": acestream_hash,
        "stream_url": hls_playlist_url,
        "hls_url": hls_playlist_url,
        "type": "hls_conversion",
        "backend": "railway_ffmpeg",
        "message": "HLS stream ready - No AceStream installation required!"
    }


@app.get("/api/stream/{acestream_hash}/playlist.m3u8")
async def get_hls_playlist(acestream_hash: str):
    """
    Get HLS playlist for an AceStream hash
    FFmpeg converts MPEG-TS to HLS on-the-fly
    """
    from .hls_converter import converter
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    acestream_hash = acestream_hash.strip()
    acestream_base = os.getenv("ACESTREAM_BASE_URL", "http://127.0.0.1:6878")
    acestream_url = f"{acestream_base}/ace/getstream?id={acestream_hash}"
    
    # Check if playlist already exists
    playlist_path = converter.get_playlist_path(acestream_hash)
    
    if not playlist_path.exists():
        # Start FFmpeg conversion
        try:
            await converter.start_conversion(acestream_hash, acestream_url)
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Failed to start HLS conversion: {str(e)}"
            )
    
    # Wait for playlist to be created (max 10 seconds)
    for _ in range(20):
        if playlist_path.exists():
            return FileResponse(
                playlist_path,
                media_type="application/vnd.apple.mpegurl",
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache",
                }
            )
        await asyncio.sleep(0.5)
    
    raise HTTPException(
        status_code=503,
        detail="HLS playlist not ready yet, please retry in a few seconds"
    )


@app.get("/api/stream/{acestream_hash}/segment_{segment_id}.ts")
async def get_hls_segment(acestream_hash: str, segment_id: str):
    """
    Get HLS segment file
    """
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    segment_path = Path(f"/app/storage/hls/{acestream_hash}/segment_{segment_id}.ts")
    
    if not segment_path.exists():
        raise HTTPException(status_code=404, detail="Segment not found")
    
    return FileResponse(
        segment_path,
        media_type="video/mp2t",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=31536000",
        }
    )


@app.api_route("/api/stream/{acestream_hash}", methods=["GET", "HEAD", "OPTIONS"])
async def proxy_acestream_stream(acestream_hash: str):
    """
    Proxy endpoint that forwards AceStream Engine stream to the client
    This makes the local AceStream Engine accessible from the internet
    Supports GET, HEAD, and OPTIONS methods for compatibility
    """
    import httpx
    from fastapi.responses import StreamingResponse, Response
    from fastapi import Request
    
    # Handle OPTIONS preflight
    if Request.method == "OPTIONS":
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            }
        )
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    acestream_hash = acestream_hash.strip()
    acestream_base = os.getenv("ACESTREAM_BASE_URL", "http://127.0.0.1:6878")
    acestream_url = f"{acestream_base}/ace/getstream?id={acestream_hash}"
    
    try:
        # For HEAD requests, just check if AceStream Engine responds
        async with httpx.AsyncClient(timeout=10.0) as client:
            if Request.method == "HEAD":
                response = await client.head(acestream_url)
                return Response(
                    status_code=response.status_code,
                    headers={
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                        "Content-Type": "video/mp2t",
                    }
                )
        
        # For GET requests, stream the content
        async def stream_generator():
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream("GET", acestream_url) as response:
                    if response.status_code != 200:
                        raise HTTPException(
                            status_code=response.status_code,
                            detail=f"AceStream Engine error: {response.status_code}"
                        )
                    async for chunk in response.aiter_bytes(chunk_size=8192):
                        yield chunk
        
        return StreamingResponse(
            stream_generator(),
            media_type="video/mp2t",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Connection": "keep-alive",
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to AceStream Engine: {str(e)}"
        )




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
