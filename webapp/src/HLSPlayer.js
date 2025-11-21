import React, { useEffect, useRef, useState } from 'react';

const HLSPlayer = ({ src, title = 'Live', onError, onReady }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let hls;
    const video = videoRef.current;
    if (!src || !video) return;

    const attach = () => {
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          onReady && onReady();
        });
        hls.on(window.Hls.Events.ERROR, (_e, data) => {
          console.error('HLS error', data);
          setError(data?.details || 'Erreur de lecture HLS');
          setLoading(false);
          onError && onError(data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          setLoading(false);
          onReady && onReady();
        });
        video.addEventListener('error', () => {
          setError('Erreur de lecture HLS (Safari)');
          setLoading(false);
        });
      } else {
        setError('HLS non supporté par ce navigateur');
        setLoading(false);
      }
    };

    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.onload = attach;
      script.onerror = () => {
        setError('Impossible de charger HLS.js');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      attach();
    }

    return () => {
      if (hls) {
        try { hls.destroy(); } catch {}
      }
    };
  }, [src, onError, onReady]);

  return (
    <div style={{ background: '#000', borderRadius: 8, overflow: 'hidden' }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ width: '100%', height: 500, background: '#000' }}
        title={title}
      />
      {loading && (
        <div style={{ padding: 12, color: '#9ca3af', textAlign: 'center' }}>🔄 Connexion au flux…</div>
      )}
      {error && (
        <div style={{ padding: 12, color: '#dc2626', textAlign: 'center' }}>❌ {error}</div>
      )}
    </div>
  );
};

export default HLSPlayer;
