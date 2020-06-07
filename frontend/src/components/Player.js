import React, { useState, useEffect } from 'react'

// APIs
import { createCollaborativePlaylist, fetchCollaborativePlaylist, searchTracks, addItemsToPlaylist,removeItemFromPlaylist } from '../services/PlaylistAPI'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'


import { Progress } from 'react-bulma-components'

import '../styles/Player.css'

let testTrack = {
    trackName: "Test Track 1",
    artistName: "Test Artist 1",
    albumName: "Test Album 1"
}

let convertedDuration = 0
let convertedElapsed = 0

const Player = (props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [playlist, setPlaylist] = useState([])
    const [elapsed, setElapsed] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [currentTrackName, setCurrentTrackName] = useState('')
    const [currentArtistName, setCurrentArtistName] = useState('')
    const [currentAlbumName, setCurrentAlbumName] = useState('')
    const [currentDuration, setCurrentDuration] = useState('')


    useEffect(() => {
        window.addEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {        
        convertedDuration = convertDuration(props.duration)

        setCurrentAlbumName(props.albumName)
        setCurrentArtistName(props.artistName)
        setCurrentDuration(convertedDuration)
        setCurrentTrackName(props.trackName)
    }, [props.trackName, props.artistName, props.albumName, props.duration])

    useEffect(() => {
        convertedElapsed = convertDuration(props.elapsedTime)
        setElapsed(convertedElapsed)
    }, [props.elapsedTime])

    const checkMobile = () => {
        if(window.innerWidth <= 1000) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
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
        isMobile == false ? (
            <div className="player">
                <div className="upper">
                    <p>Currently Playing: </p>
                    <p style={{ marginLeft: "3rem", fontWeight: 600, opacity: 1 }}>{currentTrackName}</p>
                    <p style={{ marginLeft: "0.5rem", opacity: 0.5 }}>{currentArtistName}</p>
                    {
                        props.trackName ? (
                            <p style={{ marginLeft: "0.5rem", marginRight: "0.5rem", opacity: 0.5 }}>.</p>
                        ) : null
                    }
                    <p style={{ opacity: 0.5 }}>{currentAlbumName}</p>
                </div>
                <div className="lower">
                    <FontAwesomeIcon className="volume-up" icon={faVolumeUp} size="2x" />
                    <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" />
                    <div className="time">
                        {
                            currentDuration ? (
                            <p>{elapsed.minutes}:{elapsed.seconds}</p>
                            ) : (  <p>0:00</p> )
                        }
                        <Progress className="progress" value={props.elapsedTime} max={props.duration}/>
                        {
                            currentDuration ? (
                                <p>{currentDuration.minutes}:{currentDuration.seconds}</p>
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
                        <div className="mobile-upper-2">
                            <p style={{ marginLeft: "0.5rem" }}>{testTrack.artistName}</p>
                            {
                                testTrack.trackName ? (
                                    <p style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>.</p>
                                ) : null
                            }
                            <p>{testTrack.albumName}</p>
                        </div>
                    </div>
                    <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" />
                </div>
                <div className="lower">
                {
                        currentDuration ? (
                            <p>{elapsed.minutes}:{elapsed.seconds}</p>
                        ) : (  <p>0:00</p> )
                    }
                    <Progress className="progress" value={props.elapsedTime} max={props.duration}/>
                    {
                        currentDuration ? (
                            <p>{currentDuration.minutes}:{currentDuration.seconds}</p>
                        ) : (  <p>0:00</p> )
                }
                </div>
            </div>
        )
    )
}

export default Player