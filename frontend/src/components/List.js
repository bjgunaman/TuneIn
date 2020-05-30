import React, { useState, useEffect } from 'react'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import '../styles/List.css'

const List = (props) => {
    const[playlist, setPlaylist] = useState([])

    useEffect(() => {
        let samplePlaylist = [
            {
                title: "Hello World",
                artist:  "John Doe",
                album: "It's a Hello World",
                duration: "3:20"
            },
            {
                title: "Hello Me",
                artist:  "John Doe",
                album: "It's a Hello World",
                duration: "3:20"
            }
        ]

        setPlaylist(samplePlaylist)
    }, [])

    const handleAddClick = () => {
    }

    return(
        <div className="playlist">
            <div className="playlist-title">
                <h1 id="squad-playlist-title" contentEditable="true" style={{ marginRight: 10, fontSize: 36 }}>Squad Playlist</h1>
                <FontAwesomeIcon className="edit" icon={faPen} />
            </div>
            <div className="playlist-list">
                {
                    playlist.map(({ title, artist, album, duration }) => {
                        return([
                            <div className="track">
                                <div className="track-header">
                                    <p className="song-title">{title}</p>
                                    <p style={{ opacity: 0.7 }}>{duration}</p>
                                </div>
                                <div className="track-description">
                                    <p>{artist}</p>
                                    <p style={{ marginLeft: 10, marginRight: 10 }}>.</p>
                                    <p>{album}</p>
                                </div>
                            </div>
                        ])
                    })
                }
            </div>
            <div>
                <FontAwesomeIcon onClick={handleAddClick} className="add" icon={faPlus} size="2x"/>
            </div>
        </div>
    )
}

export default List