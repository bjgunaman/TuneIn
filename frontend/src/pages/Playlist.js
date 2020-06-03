import React, { useState, useEffect } from 'react'

// Components
import List from '../components/List'
import Player from '../components/Player'

// Styles
import '../styles/Playlist.css'
import { fetchCollaborativePlaylist, 
         createCollaborativePlaylist, 
         fetchTracks, 
         play,
         fetchNumberofUsers, 
         fetchUserPlaybackState} from '../services/PlaylistAPI'

const Playlist = () => {
    const [playlist, setPlaylist] = useState(null)
    const [numberOfUsers, setNumberOfUsers] = useState(null)
    const [userID, setUserID] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        console.log("Fetch playlist")
        var searchParams = new URLSearchParams(window.location.search);
        setUserID(searchParams.get("id"))

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

    useEffect(() => {
        console.log("Fetch users")

        fetchNumberofUsers().then(data => {
            setNumberOfUsers(data)
        })
    }, [])

    useEffect(() => {
        if(isPlaying == true) {
            fetchUserPlaybackState().then(res => {
                console.log("Current user playback information in front-end: ", res)
            })
        }
    }, [isPlaying])

    const fetchCallback = () => {
        fetchCollaborativePlaylist().then(data => {
            fetchTracks().then(res => {
                console.log("fetch tracks response: ", res)
                data.tracks = res
                console.log("Playlist before: ", playlist)
                setPlaylist(data)
                console.log("Playlist after: ", data)

                if (data) {
                    console.log("Playlist is found hahaha")
                    console.log("Playlist length haha: ", data.tracks.length)
                    if(data.tracks.length > 1 && isPlaying == false) {
                        console.log("Playlist is played hahaha")
                        play(data.tracks[0].trackUri).then(res => {
                            console.log("Play response haha: ", res)
                            setIsPlaying(true)
                        })
                    }
                }
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