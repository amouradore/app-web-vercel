"""
AceStream Windows API Client
Handles communication with AceStream Engine on Windows using WebSocket API
"""
import httpx
import asyncio
from typing import Optional


class AceStreamWindows:
    def __init__(self, base_url: str = "http://127.0.0.1:6878"):
        self.base_url = base_url
        self.active_streams = {}
    
    async def get_engine_info(self):
        """Get AceStream Engine version and info"""
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{self.base_url}/webui/api/service",
                params={"method": "get_version"}
            )
            return response.json()
    
    async def start_stream(self, content_id: str) -> dict:
        """
        Start streaming an AceStream content
        
        Args:
            content_id: AceStream hash (40 characters)
        
        Returns:
            dict with stream info including command_url, stat_url, etc.
        """
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Start the stream using AceStream API
            response = await client.get(
                f"{self.base_url}/webui/api/service",
                params={
                    "method": "start",
                    "id": content_id,
                    "format": "json"
                }
            )
            
            result = response.json()
            
            if result.get("error"):
                raise Exception(f"AceStream error: {result['error']}")
            
            # Result contains:
            # - command_url: for sending commands
            # - event_url: for receiving events  
            # - stat_url: for statistics
            # - playback_url: the URL to play the stream
            
            return result.get("result", {})
    
    async def stop_stream(self, content_id: str):
        """Stop streaming"""
        if content_id in self.active_streams:
            stat_url = self.active_streams[content_id].get("stat_url")
            if stat_url:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    await client.get(stat_url, params={"method": "stop"})
            del self.active_streams[content_id]
    
    def get_playback_url(self, stream_info: dict) -> str:
        """
        Extract playback URL from stream info
        
        The playback URL is the actual HTTP URL to the MPEG-TS stream
        """
        # AceStream Windows returns playback_url in the result
        if "playback_url" in stream_info:
            return stream_info["playback_url"]
        
        # Fallback: construct from command_url
        if "command_url" in stream_info:
            # command_url looks like: http://127.0.0.1:6878/.../{session_id}/...
            # We need to extract the session and build playback URL
            command_url = stream_info["command_url"]
            # For now, return the command URL as it might work
            return command_url.replace("/command/", "/content/")
        
        return None


# Global instance
acestream_client = AceStreamWindows()
