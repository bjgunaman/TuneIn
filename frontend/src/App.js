import React from 'react';

// Components
import Playlist from './components/Playlist'
import Player from './components/Player'

import './App.css';

function App() {
  return (
    <div className="App">
      <Playlist/>
      <button className="invite">Invite</button>
      <Player />
    </div>
  );
}

export default App;
