import React, { useState, useEffect } from 'react'

// Components
import List from '../components/List'
import Player from '../components/Player'

// Styles
import '../styles/Playlist.css'
import { fetchUserData } from '../services/PlaylistAPI'

const Playlist = () => {
    useEffect(() => {
        
    }, [])

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