import React from 'react';
import ChannelList from './ChannelList';
import './App.css';

/**
 * Nouvelle App principale - Version simplifiée avec backend HLS
 * SANS INSTALLATION ACESTREAM REQUISE
 */
function NewApp() {
  return (
    <div className="App">
      <ChannelList />
    </div>
  );
}

export default NewApp;
