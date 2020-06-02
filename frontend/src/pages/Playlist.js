import React, { useState, useEffect } from 'react'

// Components
import List from '../components/List'
import Player from '../components/Player'

// Styles
import '../styles/Playlist.css'
import { fetchCollaborativePlaylist, createCollaborativePlaylist, fetchTracks, play } from '../services/PlaylistAPI'

const Playlist = () => {
    const [playlist, setPlaylist] = useState(null)

    useEffect(() => {
        console.log("Looped")

        fetchCollaborativePlaylist().then(data => {
            if (data == 404) {
                createCollaborativePlaylist().then(res => {
                    console.log("Create: ", res)
                    setPlaylist(res)
                })
            } else {
                console.log("Playlist data in front: ", data)
                setPlaylist(data)
            }  
        })
    }, [])

    const fetchCallback = () => {
        fetchCollaborativePlaylist().then(data => {
            fetchTracks().then(res => {
                data.tracks = res
                console.log("Playlist before: ", playlist)
                setPlaylist(data)
                console.log("Playlist after: ", playlist)
            })
        })
    }
    const playTrack = () => {

    }

    return(
        <div className="App">
            <div className="list">
                <List callback={fetchCallback} playlist={playlist} />
                <button className="invite">Invite</button>
            </div>
            <Player />
        </div>
        
    )
}

export default Playlist