import React from 'react'

// Components
import List from '../components/List'
import Player from '../components/Player'

// Styles
import '../styles/Playlist.css'

const Playlist = () => {
    return(
        <div className="App">
            <div className="list">
                <List />
                <button className="invite">Invite</button>
            </div>
            <Player />
        </div>
        
    )
}

export default Playlist