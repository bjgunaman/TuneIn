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
         fetchUserPlaybackState, 
         removeTracks,
         fetchAccessToken,
         playPlayer } from '../services/PlaylistAPI'

let player = null
let previousTrack = ''
let counter = 0
let playlistGlobal = null
let userID = null

const Playlist = () => {
    const [playlist, setPlaylist] = useState(null)
    const [numberOfUsers, setNumberOfUsers] = useState(null)
    const [userID, setUserID] = useState(null)
    const [checkInterval, setCheckInterval] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [accessToken, setAccessToken] = useState(null)

    useEffect(() => {
        console.log("Fetch playlist")

        var searchParams = new URLSearchParams(window.location.search);
        setUserID(searchParams.get("id"))
        checkForPlayer()

        fetchCollaborativePlaylist().then(data => {
            if (data == 404) {
                createCollaborativePlaylist().then(res => {
                    console.log("Create: ", res)
                    setPlaylist(res)
                    playlistGlobal = res
                })
            } else {
                console.log("Playlist data in front: ", data)
                setPlaylist(data)
                playlistGlobal = data
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
                playlistGlobal = data
                console.log("Playlist after: ", data)

                if (data) {
                    console.log("Playlist is found hahaha")
                    console.log("Playlist length haha: ", data.tracks.length)
                    if(data.tracks.length > 1 && isPlaying == false) {
                        console.log("Playlist is played hahaha")
                        play(data.tracks[0].trackUri).then(res => {
                            console.log("Play response haha: ", res)
                            setIsPlaying(true)
                            console.log("Prev track before: ", previousTrack)
                            previousTrack = data.tracks[0].trackUri
                            console.log("Prev track after: ", previousTrack)
                            console.log("Track uri: ", data.tracks[0].trackUri)
                            	
                            player.nextTrack().then(() => {
                                console.log('Skipped to next track!');
                            });
                        })

                        // player.togglePlay().then(() => {
                        //     console.log('Toggled playback!');
                        //     setIsPlaying(true)
                        //     previousTrack = data.tracks[0].trackUri
                        // });
                    }
                }
            })
        })
    }

    const checkForPlayer = () => {
        fetchAccessToken().then(data => {
            setAccessToken(data.access_token)

            if(window.Spotify !== null) {
                const token = data.access_token
                player = new window.Spotify.Player({
                    name: "Songs With Friends",
                    getOAuthToken: cb => { cb(token) }
                })

                player.addListener('initialization_error', ({ message }) => { console.error(message); })
                player.addListener('authentication_error', ({ message }) => { console.error(message); })
                player.addListener('account_error', ({ message }) => { console.error(message); })
                player.addListener('playback_error', ({ message }) => { console.error(message); })
              
                // Playback status updates
                // player.addListener('player_state_changed', state => { console.log(state); })
              
                player.addListener('player_state_changed', ({
                    position,
                    duration,
                    track_window: { current_track }
                }) => {
                    console.log('Currently Playing', current_track);
                    console.log('Position in Song', position);
                    console.log('Duration of Song', duration);

                    console.log("Current track uri: ", current_track.uri)
                    console.log("Previous track uri: ", previousTrack)
                    
                    if(previousTrack != '') {
                        console.log("Checking removal condition: ", current_track)
                        // console.log("Playlst[90]: ", playlist.tracks[0].trackUri)

                        // if(current_track.uri != previousTrack) {
                        //     console.log("Currently removing")
                        //     removeTracks(previousTrack).then(res => {
                        //         console.log("Successfully removed: ", res)
                        //     })      
                        // }
                        
                        // if (position == 0 && current_track.uri == previousTrack) {
                        //     console.log("Currently playing")
                        //     counter += 1
                        // }

                        // if (counter >= 2) {
                        //     removeTracks(previousTrack).then(res => {
                        //         console.log("Successfully removed: ", res)
                                    
                                
                        //     })
                        //     fetchCollaborativePlaylist().then(data => {
                        //         fetchTracks().then(res => {
                        //             data.tracks = res
                        //             console.log("Position equals duration")
                        //             console.log(data)
                        //             play(data.tracks[0].trackUri).then(res => {
                        //                 console.log("Play response haha: ", res)
                        //                 setIsPlaying(true)
                        //                 counter = 1
                        //                 console.log("Prev track before: ", previousTrack)
                        //                 console.log("Prev track after: ", previousTrack)
                        //                 console.log("Track uri: ", data.tracks[0].trackUri)
                        //             })
                        //         })
                        //     })
                        // }

                        if(current_track.uri != previousTrack) {
                            console.log("Currently removing")
                            removeTracks(previousTrack).then(res => {
                                console.log("Successfully removed: ", res)

                                fetchCollaborativePlaylist().then(data => {
                                    fetchTracks().then(res => {
                                        data.tracks = res
                                        setPlaylist(data)
                                        playlistGlobal = data
                                    })
                                })
                            })      
                        }

                        // if(position == duration) {
                        //     play(playlistGlobal.tracks[0].trackUri).then(res => {
                        //         console.log("Play response haha: ", res)
                        //         setIsPlaying(true)
                        //         counter = 1
                        //         console.log("Prev track before: ", previousTrack)
                        //         console.log("Prev track after: ", previousTrack)
                        //         console.log("Track uri: ", playlistGlobal.tracks[0].trackUri)
                        //     })
                        // }

                        previousTrack = current_track.uri
                    } 
                });
                
                // Ready
                player.addListener('ready', ({ device_id }) => {
                  console.log('Ready with Device ID', device_id);
                })
              
                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                  console.log('Device ID has gone offline', device_id);
                })

                player.connect()
            }
        })
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

function printUserID() {
  console.log("This is the userID on the frontend:", userID);
}

// userID is empty even though I made a global variable and it was set
printUserID();

export default Playlist