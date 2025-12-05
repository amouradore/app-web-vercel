# FFmpeg Configuration for Backend

## ✅ Status: Installed and Tested

FFmpeg is configured and ready for AceStream to HLS conversion on Render.

## 🧪 Run Tests

```bash
# Full test suite (6 tests)
python test_ffmpeg.py

# Quick verification
bash verify_ffmpeg.sh
```

## 🔧 Configuration Files

- `Dockerfile` - Installs FFmpeg with H.264/AAC support
- `start.sh` - Verifies FFmpeg on startup
- `render.yaml` - Environment variables
- `build.sh` - Custom build script (optional)

## 📊 Environment Variables

```yaml
FFMPEG_ENABLED: "true"
FFMPEG_LOG_LEVEL: "warning"
```

## 🎬 Usage in Code

```python
# Example: Convert AceStream to HLS
ffmpeg_cmd = [
    'ffmpeg',
    '-i', acestream_url,
    '-c:v', 'copy',
    '-c:a', 'copy',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '6',
    output_path
]
```

## 📚 Full Documentation

See `FFMPEG_INSTALLATION.md` for complete documentation.
