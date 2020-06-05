import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';

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
         playPlayer, 
         postAddToQueue } from '../services/PlaylistAPI'
import Chatbox from '../components/Chatbox'

let player = null
let previousTrack = ''
let counter = 0
let playlistGlobal = null
let userIDGlobal = null
let numberOfUsersMoreThanTwo = false
let isPlaying = false

const Playlist = () => {
    const [playlist, setPlaylist] = useState(null)
    const [numberOfUsers, setNumberOfUsers] = useState(null)
    const [userID, setUserID] = useState(null)
    const [checkInterval, setCheckInterval] = useState(null)
    // const [isPlaying, setIsPlaying] = useState(false)
    const [accessToken, setAccessToken] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const socket = io('localhost:8080');

    useEffect(() => {
        console.log("Fetch playlist")

        var searchParams = new URLSearchParams(window.location.search);
        setUserID(searchParams.get("id"))
        userIDGlobal = searchParams.get("id")

        checkForPlayer()

        window.addEventListener("resize", checkMobile)

        fetchCollaborativePlaylist().then(data => {
            if (data == 404) {
                createCollaborativePlaylist().then(res => {
                    console.log("Create: ", res)
                    res.tracks = []
                    setPlaylist(res)
                    playlistGlobal = res
                })
            } else {
                console.log("Playlist data in front: ", data)
                setPlaylist(data)
                playlistGlobal = data
            }  
        })

        // setInterval(checkNumberUser, 100)
        socket.emit('getNumberOfUsers')
        socket.on('receiveNumberOfUsers', (numberOfUser) => {
            console.log("CURRENTNUMBEROFUSER2.0:", numberOfUser.NUM_USERS)
            if (numberOfUsers != numberOfUser.NUM_USERS) {
                setNumberOfUsers(numberOfUser.NUM_USERS)
            }
            console.log("TESTING3.0")
            if(!numberOfUsersMoreThanTwo) {
                if(numberOfUser.NUM_USERS >= 2 ) {
                    numberOfUsersMoreThanTwo = true
                }
            }
            console.log("TESTING 4.0")
            if(playlistGlobal) {
                console.log("HERE 3.0")
                if(isPlaying == false && playlistGlobal.tracks.length > 0 && numberOfUsersMoreThanTwo == true) {
                    console.log("HERE 4.0")
                    play(playlistGlobal.tracks[0].uri, userIDGlobal).then(res => {
                        isPlaying = true
                    })
                }
            }
        })
        socket.on('newUserIncoming', (numberOfUser) => {

            console.log("CURRENTNUMBEROFUSER:", numberOfUser.NUM_USERS)
            if (numberOfUsers != numberOfUser.NUM_USERS) {
                setNumberOfUsers(numberOfUser.NUM_USERS)
            }
            console.log("TESTING")
            if(!numberOfUsersMoreThanTwo) {
                if(numberOfUser.NUM_USERS >= 2 ) {
                    numberOfUsersMoreThanTwo = true
                }
            }
            console.log("TESTING 2.0")
            if(playlistGlobal) {
                console.log("HERE 1.0")
                if(isPlaying == false && playlistGlobal.tracks.length > 0 && numberOfUsersMoreThanTwo == true) {
                    console.log("HERE 2.0")
                    play(playlistGlobal.tracks[0].uri, userIDGlobal).then(res => {
                        isPlaying = true
                    })
                }
            }
        })

        socket.on("othersAddItemToQueue", (trackUri) => {
            console.log("Socket client track uri: ", trackUri.trackUri)
            postAddToQueue(trackUri.trackUri, userIDGlobal).then(res => {
                console.log("Add to queue to front-end")
                
                
            })
        })
        socket.on("toPlay", (trackUri) => {
            console.log("CHECKING AND PLAYING", trackUri)
            checkAndPlay()
        })
    }, [])

    const checkMobile = () => {
        if(window.innerWidth <= 500) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    const checkAndPlay = () => {
        fetchCollaborativePlaylist().then(data => {
            fetchTracks().then(res => {
                console.log("fetch tracks response: ", res)
                data.tracks = res
                console.log("Playlist before: ", playlist)
                setPlaylist(data)
                playlistGlobal = data
                console.log("Playlist after: ", data)

                if(playlistGlobal) {
                    // console.log("HERE 1.0")
                    if(isPlaying == false && playlistGlobal.tracks.length > 0 && numberOfUsersMoreThanTwo == true) {
                        // console.log("HERE 2.0")
                        console.log("Global Playlist: ", playlistGlobal.tracks[0].trackUri)
                        // console.log("Global Playlist track uri: ", playlistGlobal.tracks[0].uri)
                        play(playlistGlobal.tracks[0].trackUri, userIDGlobal).then(res => {
                            isPlaying = true
                            player.nextTrack().then(() => {
                                console.log('Skipped to next track!');
                            });
                        })
                    }
                }
            })
        })
    }

    // useEffect(() => {
    //     fetchNumberofUsers().then(data => {
    //         console.log("Number of users client: ", data.num_user)
    //         if (numberOfUsers != data.num_user) {
    //             setNumberOfUsers(data.num_user)
    //         }
    //         console.log("TESTING")
    //         if(!numberOfUsersMoreThanTwo) {
    //             if(data.num_user >= 2 ) {
    //                 numberOfUsersMoreThanTwo = true
    //             }
    //         }
    //         console.log("TESTING 2.0")
    //         if(playlistGlobal) {
    //             console.log("HERE 1.0")
    //             if(isPlaying == false && playlistGlobal.tracks.length > 0 && numberOfUsersMoreThanTwo == true) {
    //                 console.log("HERE 2.0")
    //                 play(playlistGlobal.tracks[0].uri, userIDGlobal).then(res => {
    //                     setIsPlaying(true)
    //                 })
    //             }
    //         }
    //     })
    // }, [numberOfUsers])

    // useEffect(() => {
    //     if(playlistGlobal) {
    //         console.log("HERE 1.0")
    //         if(isPlaying == false && playlistGlobal.tracks.length > 0 && numberOfUsersMoreThanTwo == true) {
    //             console.log("HERE 2.0")
    //             play(playlistGlobal.tracks[0].uri, userIDGlobal).then(res => {
    //                 setIsPlaying(true)
    //             })
    //         }
    //     }
    // }, [playlist])

    // useEffect(() => {
    //     console.log("Fetch users")

    //     fetchNumberofUsers().then(data => {
    //         setNumberOfUsers(data)
    //     })
    // }, [])

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

                // if (data) {
                //     console.log("Playlist is found hahaha")
                //     console.log("Playlist length haha: ", data.tracks.length)
                //     if(data.tracks.length > 1 && isPlaying == false) {
                //         console.log("Playlist is played hahaha")
                //         play(data.tracks[0].trackUri, userIDGlobal).then(res => {
                //             console.log("Play response haha: ", res)
                //             setIsPlaying(true)
                //             console.log("Prev track before: ", previousTrack)
                //             previousTrack = data.tracks[0].trackUri
                //             console.log("Prev track after: ", previousTrack)
                //             console.log("Track uri: ", data.tracks[0].trackUri)
                            	
                //             player.nextTrack().then(() => {
                //                 console.log('Skipped to next track!');
                //             });
                //         })

                //         player.togglePlay().then(() => {
                //             console.log('Toggled playback!');
                //             setIsPlaying(true)
                //             previousTrack = data.tracks[0].trackUri
                //         });
                //     }
                // }
            })
        })
    }

    const checkForPlayer = () => {
        fetchAccessToken(userIDGlobal).then(data => {
            setAccessToken(data.access_token)
            console.log("Current user's access token: ", data.access_token)

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
        isMobile == false ? (
            <div className="App">
                <div className="list">
                    <List initSocket={socket} callback={fetchCallback} playlist={playlist}/>
                    <button className="invite" onClick={() => {
                        alert('http://localhost:8000/')
                    }}>Invite</button>
                </div>
                <Player />
                <Chatbox initSocket={socket}/>
            </div>
        ) : (
            <div className="App">
                <div className="list">
                    <List callback={fetchCallback} playlist={playlist} />
                    <button className="invite" onClick={() => {
                        alert('http://localhost:8000/')
                    }}>Invite</button>
                </div>
                <Player />
            </div> 
        )
    )
}

export default Playlist