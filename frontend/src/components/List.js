import React, { useState, useEffect } from 'react'

// Components
import Search from './Search'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import '../styles/List.css'
import { play } from '../services/PlaylistAPI'

const List = (props) => {
    const[playlist, setPlaylist] = useState([])
    const[showPopUp, setShowPopUp] = useState(false)

    useEffect(() => {
        setPlaylist(props.playlist)
    }, [props.playlist])

    const handleShowPopUp = (set) => {
        setShowPopUp(set)
    }

    const convertDuration = (duration) => {
        let stringSeconds = ''
        let stringMinutes = ''

        let minutes = Math.floor(duration / (1000 * 60))
        let seconds = Math.floor((duration / 1000) % 60)

        if(seconds < 10) {
            stringSeconds = '0' + seconds
        } else {
            stringSeconds = seconds.toString()
        }

        stringMinutes = minutes.toString()

        let res = {
            minutes: stringMinutes,
            seconds: stringSeconds
        }

        return res   
    }

    return(
        props.playlist ? (
            <div className="playlist">
                <div className="playlist-title">
                    <h1 id="squad-playlist-title" contentEditable="true" style={{ marginRight: 10, fontSize: 36 }}>Squad Playlist</h1>
                    <FontAwesomeIcon className="edit" icon={faPen} />
                </div>
                <div className="playlist-list">
                    {
                        playlist ? (
                            playlist.map(({ trackInfo }) => {
                                let convertedDuration = convertDuration(trackInfo.duration)

                                return([
                                    <div className="track">
                                        <div className="track-header">
                                            <p className="song-title">{trackInfo.trackName}</p>
                                            <p style={{ opacity: 0.7 }}>{convertedDuration.minutes}:{convertedDuration.seconds}</p>
                                        </div>
                                        <div className="track-description">
                                            <p>{trackInfo.artistName}</p>
                                            <p style={{ marginLeft: 10, marginRight: 10 }}>.</p>
                                            <p>{trackInfo.albumName}</p>
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
                        <Search initSocket={props.initSocket} callback={props.callback} handle={() => handleShowPopUp(false)}/>
                    ) : null
                }
            </div>
        ) : null
    )
}

export default List