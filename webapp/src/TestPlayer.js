import React, { useState } from 'react';
import AceStreamWebPlayer from './AceStreamWebPlayer';
import './AceStreamWebPlayer.css';

const TestPlayer = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  
  const testHashes = [
    {
      name: "DAZN F1 HD",
      hash: "d65257bb934b73647374224fd62d836815804be2",
      description: "Formule 1 en direct"
    },
    {
      name: "DAZN LaLiga", 
      hash: "dda5d2cace9bc4cb0918e62bc50d657d4a10496a",
      description: "Football espagnol"
    },
    {
      name: "La 1 HD",
      hash: "b55d1a3d7a5121af685668d5f5e7baeb3ebab70e", 
      description: "Chaîne généraliste espagnole"
    }
  ];
  
  const testStream = (hash, name) => {
    setCurrentHash(hash);
    setShowPlayer(true);
    console.log(`🧪 Test du stream: ${name} avec hash: ${hash}`);
  };
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Test AceStream Web Player</h1>
      
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        borderRadius: '8px', 
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h3>✅ Test Réussi : Composant Chargé !</h3>
        <p>Le nouveau AceStreamWebPlayer est correctement importé et prêt à être testé.</p>
      </div>
      
      <h2>📺 Streams de Test</h2>
      
      {testHashes.map((stream, index) => (
        <div key={index} style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>{stream.name}</h3>
          <p style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '14px' }}>
            {stream.description}
          </p>
          <p style={{ 
            fontFamily: 'monospace', 
            background: '#1f2937', 
            color: '#e5e7eb',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            margin: '0 0 10px 0'
          }}>
            Hash: {stream.hash}
          </p>
          <button 
            onClick={() => testStream(stream.hash, stream.name)}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🧪 Tester ce stream
          </button>
        </div>
      ))}
      
      {showPlayer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '95vw',
            maxHeight: '95vh',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>🧪 Test du Web Player</h3>
              <button 
                onClick={() => setShowPlayer(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <AceStreamWebPlayer 
              aceStreamHash={currentHash}
              title="Stream de Test"
              onError={(error) => {
                console.error('Erreur du test:', error);
                alert(`Erreur du web player: ${error}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPlayer;