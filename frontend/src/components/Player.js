import React, { useState, useEffect } from 'react'

// APIs
import { createCollaborativePlaylist, fetchCollaborativePlaylist, searchTracks, addItemsToPlaylist,removeItemFromPlaylist } from '../services/PlaylistAPI'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'

import '../styles/Player.css'

let testTrack = {
    trackName: "Test Track 1",
    artistName: "Test Artist 1",
    albumName: "Test Album 1"
}

const Player = (props) => {
    // const [title, setTitle] = useState('')
    // const [artist, setArtist] = useState('')
    // const [album, setAlbum] = useState('')
    // const [time, setTime] = useState({ 
    //     "elapsed-time": "0:00",
    //     "total-time": "0:00"
    // })

    const [isPlaying, setIsPlaying] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [minutes, setMinutes] = useState({
        minutes: 0,
        seconds: 0
    })
    const [isMobile, setIsMobile] = useState(false)

    useEffect(async () => {
        //createCollaborativePlaylist()
        console.log("fetching/.....")
        // await fetchCollaborativePlaylist();
        const query = 'lockdown';
        //searchTracks(query)
        //await addItemsToPlaylist();
        // await removeItemFromPlaylist();
        // setTitle('Almost (Sweet Music)')
        // setArtist('Hozier')
        // setAlbum('Wastland, Baby!')
        console.log("Window width: ", props.windowWidth)

        window.addEventListener("resize", checkMobile)
        
        setMinutes({
            minutes: "0",
            seconds: "00"
        })
    }, [])

    const checkMobile = () => {
        if(window.innerWidth <= 1000) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    return(
        isMobile == false ? (
            <div className="player">
                <div className="upper">
                    <p>Currently Playing: </p>
                    <p style={{ marginLeft: "3rem", fontWeight: 600, opacity: 1 }}>{props.trackName}</p>
                    <p style={{ marginLeft: "0.5rem" }}>{props.artistName}</p>
                    {
                        props.trackName ? (
                            <p style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>.</p>
                        ) : null
                    }
                    <p style={{ marginLeft: "0.5rem" }}>{props.albumName}</p>
                </div>
                <div className="lower">
                    <FontAwesomeIcon className="volume-up" icon={faVolumeUp} size="2x" />
                    <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" />
                    <div className="time">
                        {
                            props.duration ? (
                                <p>{props.duration}</p>
                            ) : (  <p>{minutes.minutes}:{minutes.seconds}</p> )
                        }
                        <div className="progress-bar">
                            <div className="filler" />
                        </div>
                        {
                            props.duration ? (
                                <p>{props.duration}</p>
                            ) : (  <p>0:00</p> )
                        }
                    </div>
                </div>
            </div>
        ) : (
            <div className="player">
                <div className="upper">
                    <FontAwesomeIcon className="volume-up" icon={faVolumeUp} size="2x" />
                    <div className="mobile-upper">
                        <div>
                            <p style={{ marginLeft: "3rem", fontWeight: 600, opacity: 1 }}>{testTrack.trackName}</p>
                        </div>
                        <div>
                            <p style={{ marginLeft: "0.5rem" }}>{testTrack.artistName}</p>
                            {
                                testTrack.trackName ? (
                                    <p style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>.</p>
                                ) : null
                            }
                            <p style={{ marginLeft: "0.5rem" }}>{testTrack.albumName}</p>
                        </div>
                    </div>
                    <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" />
                </div>
                <div className="lower">
                    {/* <FontAwesomeIcon className="volume-up" icon={faVolumeUp} size="2x" />
                    <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" /> */}
                </div>
            </div>
        )
    )
}

export default Player