"""
HLS Converter - Converts AceStream MPEG-TS to HLS format using FFmpeg
"""
import subprocess
import os
import asyncio
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class HLSConverter:
    def __init__(self, storage_dir="/app/storage/hls"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.active_conversions = {}
    
    async def start_conversion(self, acestream_hash: str, acestream_url: str):
        """
        Start FFmpeg conversion from AceStream MPEG-TS to HLS
        """
        if acestream_hash in self.active_conversions:
            logger.info(f"Conversion already running for {acestream_hash}")
            return
        
        # Create output directory for this stream
        output_dir = self.storage_dir / acestream_hash
        output_dir.mkdir(parents=True, exist_ok=True)
        
        playlist_path = output_dir / "playlist.m3u8"
        
        # FFmpeg command to convert MPEG-TS to HLS
        ffmpeg_cmd = [
            'ffmpeg',
            '-i', acestream_url,  # Input: AceStream MPEG-TS stream
            '-c:v', 'copy',       # Copy video codec (no re-encoding)
            '-c:a', 'copy',       # Copy audio codec (no re-encoding)
            '-f', 'hls',          # Output format: HLS
            '-hls_time', '4',     # Segment duration: 4 seconds
            '-hls_list_size', '10',  # Keep last 10 segments in playlist
            '-hls_flags', 'delete_segments+append_list',  # Delete old segments
            '-hls_segment_filename', str(output_dir / 'segment_%03d.ts'),
            '-y',                 # Overwrite output
            str(playlist_path)
        ]
        
        logger.info(f"Starting FFmpeg conversion for {acestream_hash}")
        logger.debug(f"Command: {' '.join(ffmpeg_cmd)}")
        
        try:
            # Start FFmpeg process
            process = await asyncio.create_subprocess_exec(
                *ffmpeg_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            self.active_conversions[acestream_hash] = {
                'process': process,
                'playlist_path': playlist_path,
                'output_dir': output_dir
            }
            
            # Monitor FFmpeg output in background
            asyncio.create_task(self._monitor_conversion(acestream_hash, process))
            
            # Wait a bit for first segments to be created
            await asyncio.sleep(5)
            
            return playlist_path
            
        except Exception as e:
            logger.error(f"Failed to start FFmpeg: {e}")
            raise
    
    async def _monitor_conversion(self, acestream_hash: str, process):
        """
        Monitor FFmpeg conversion process
        """
        try:
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                logger.error(f"FFmpeg failed for {acestream_hash}: {stderr.decode()}")
            else:
                logger.info(f"FFmpeg completed for {acestream_hash}")
                
        except Exception as e:
            logger.error(f"Error monitoring FFmpeg: {e}")
        finally:
            if acestream_hash in self.active_conversions:
                del self.active_conversions[acestream_hash]
    
    def get_playlist_path(self, acestream_hash: str):
        """
        Get the playlist path for a hash
        """
        return self.storage_dir / acestream_hash / "playlist.m3u8"
    
    def stop_conversion(self, acestream_hash: str):
        """
        Stop FFmpeg conversion for a hash
        """
        if acestream_hash in self.active_conversions:
            conversion = self.active_conversions[acestream_hash]
            process = conversion['process']
            
            try:
                process.terminate()
                logger.info(f"Stopped conversion for {acestream_hash}")
            except Exception as e:
                logger.error(f"Error stopping conversion: {e}")
            
            del self.active_conversions[acestream_hash]

# Global converter instance
converter = HLSConverter()
