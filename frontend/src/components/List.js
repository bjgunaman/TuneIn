import React, { useState, useEffect } from 'react'

// Components
import Search from './Search'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import '../styles/List.css'

const List = (props) => {
    const[playlist, setPlaylist] = useState([])
    const[showPopUp, setShowPopUp] = useState(false)

    useEffect(() => {
        // console.log(props.playlist)
        // setPlaylist(props.playlist)
    }, [])

    const handleShowPopUp = (set) => {
        setShowPopUp(set)
    }

    return(
        props.playlist ? (
            <div className="playlist">
                <div className="playlist-title">
                    <h1 id="squad-playlist-title" contentEditable="true" style={{ marginRight: 10, fontSize: 36 }}>{props.playlist.name}</h1>
                    <FontAwesomeIcon className="edit" icon={faPen} />
                </div>
                <div className="playlist-list">
                    {
                        props.playlist.tracks ? (
                            props.playlist.tracks.map(({ trackName, artistName, albumName, duration }) => {
                                return([
                                    <div className="track">
                                        <div className="track-header">
                                            <p className="song-title">{trackName}</p>
                                            <p style={{ opacity: 0.7 }}>{duration}</p>
                                        </div>
                                        <div className="track-description">
                                            <p>{artistName}</p>
                                            <p style={{ marginLeft: 10, marginRight: 10 }}>.</p>
                                            <p>{albumName}</p>
                                        </div>
                                    </div>
                                ])
                            }) 
                        ) : (
                            <p>No Tracks in playlist</p>
                        )
                    }
                </div>
                <div>
                    <FontAwesomeIcon onClick={() => {handleShowPopUp(true)}} className="add" icon={faPlus} size="2x"/>
                </div>
                {
                    showPopUp ? (
                        <Search callback={props.callback} handle={() => handleShowPopUp(false)}/>
                    ) : null
                }
            </div>
        ) : null
    )
}

export default List