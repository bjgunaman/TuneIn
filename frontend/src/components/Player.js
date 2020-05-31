import React, { useState, useEffect } from 'react'

// APIs
import { createCollaborativePlaylist } from '../services/PlaylistAPI'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'

import '../styles/Player.css'

const Player = (props) => {
    const [title, setTitle] = useState('')
    const [artist, setArtist] = useState('')
    const [album, setAlbum] = useState('')
    const [time, setTime] = useState({ 
        "elapsed-time": "0:00",
        "total-time": "0:00"
    })

    useEffect(() => {
        createCollaborativePlaylist()
        
        // setTitle('Almost (Sweet Music)')
        // setArtist('Hozier')
        // setAlbum('Wastland, Baby!')
    }, [])

    return(
        <div className="player">
            <div className="upper">
                <p>Currently Playing: </p>
                <p style={{ marginLeft: "3rem", fontWeight: 600, opacity: 1 }}>{title}</p>
                <p style={{ marginLeft: "0.5rem" }}>{artist}</p>
                <p style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>.</p>
                <p style={{ marginLeft: "0.5rem" }}>{album}</p>
            </div>
            <div className="lower">
                <FontAwesomeIcon className="volume-up" icon={faVolumeUp} size="2x" />
                <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" />
                <div className="time">
                    <p>{time["elapsed-time"]}</p>
                    <div className="progress-bar">
                        <div className="filler" />
                    </div>
                    <p>{time["total-time"]}</p>
                </div>
            </div>
        </div>
    )
}

export default Player