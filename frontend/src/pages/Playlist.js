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
         postAddToQueue,
         fetchUserCurrPlayingTrack } from '../services/PlaylistAPI'
import Chatbox from '../components/Chatbox'

let player = null
let previousTrack = ''
let counter = 0
let playlistGlobal = []
let userIDGlobal = null
let numberOfUsersMoreThanTwo = false
let isPlaying = false
let isHost = false
let currentTrackUri = '';
let previousTrackUri = '';
let position_ms = '';

const Playlist = () => {
    const [playlist, setPlaylist] = useState([])
    const [numberOfUsers, setNumberOfUsers] = useState(null)
    const [userID, setUserID] = useState(null)
    const [checkInterval, setCheckInterval] = useState(null)
    // const [isPlaying, setIsPlaying] = useState(false)
    const [accessToken, setAccessToken] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const socket = io('localhost:8080');

    var searchParams = new URLSearchParams(window.location.search);
    userIDGlobal = searchParams.get("id")
    if(searchParams.get("host") == 'true') {
        console.log("HOST SET")
        isHost = true
    }
    console.log("userIDGlobal: ",userIDGlobal);

    useEffect(() => {
        console.log("Fetch playlist")

        setUserID(searchParams.get("id"))
        
        //checkForPlayer()

        window.addEventListener("resize", checkMobile)

        //fetching playlist from server
        fetchCollaborativePlaylist().then(data => {
            setPlaylist(data.serverPlaylist);
            playlistGlobal = data.serverPlaylist;
        })
        
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
            // if(playlistGlobal) {
            //     console.log("HERE 3.0")
            //     if(isPlaying == false && playlistGlobal.length > 0 && numberOfUsersMoreThanTwo == true) {
            //         console.log("HERE 4.0")
            //         play(playlistGlobal[0].trackInfo.trackUri, userIDGlobal).then(res => {
            //             isPlaying = true
            //             currentTrackUri = playlistGlobal[0].trackInfo.trackUri
            //             previousTrackUri = playlistGlobal[0].trackInfo.trackUri
            //         })
            //     }
            // }
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
            
        })

        socket.on("othersAddItemToQueue", (trackUri) => {
            console.log("Socket client track uri: ", trackUri.trackUri)
            // postAddToQueue(trackUri.trackUri, userIDGlobal).then(res => {
            //     console.log("Add to queue to front-end")
                
                
            // })
        })

        socket.on('pleaseFetch', () => {
            fetchCallback()
        })

        setInterval(() => {
            fetchUserCurrPlayingTrack().then(data => {
                console.log("Get current status code: ", data.statusCode)
                if (data.statusCode == 200 && data.is_playing == false) {
                    if(playlistGlobal) {
                        console.log("HERE 1.0")
                        if(playlistGlobal.length > 0 && numberOfUsersMoreThanTwo == true) {
                            console.log("HERE 2.0")
                            play(playlistGlobal[0].trackInfo.trackUri, userIDGlobal).then(res => {
                                // isPlaying = true
                                currentTrackUri = playlistGlobal[0].trackInfo.trackUri;
                                if (currentTrackUri !== previousTrackUri) {
                                    console.log("IS HOST: ", isHost);
                                    if(isHost) {
                                        removeTracks().then(playlistInfo => {
                                            playlistGlobal = playlistInfo.serverPlaylist
                                            setPlaylist(playlistInfo.serverPlaylist)
                                            socket.emit('addSongsFetchNew')
                                        })
                                    }
                                    previousTrackUri = currentTrackUri
                                }
                                
                            })
                        }
                    }
                }
                else {
                    position_ms = data.position_ms
                    currentTrackUri = data.uri
                }
            })
        }, 500)
    }, [])

    useEffect(() => {
        console.log("Useffect update playlist: ", playlistGlobal)
        setPlaylist(playlistGlobal)
    }, [playlistGlobal])

    const checkMobile = () => {
        if(window.innerWidth <= 1000) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    const populateQueue = () => {
        fetchCollaborativePlaylist().then(data => {
            playlistGlobal = data.serverPlaylist
            setPlaylist(data.serverPlaylist);
        })
    }

    const checkAndPlay = () => {
        fetchCollaborativePlaylist().then(data => {
            playlistGlobal = data.serverPlaylist;
            setPlaylist(data.serverPlaylist);
            if(playlistGlobal) {
                // console.log("HERE 1.0")\
                //if not playing and playlist has more than one song and more than one user in the room
                if(isPlaying == false && playlistGlobal.length > 0 && numberOfUsersMoreThanTwo == true) {
                    // console.log("HERE 2.0")
                    console.log("Global Playlist: ", playlistGlobal[0].trackInfo.trackUri)
                    
                    // console.log("Global Playlist track uri: ", playlistGlobal.tracks[0].uri)
                    play(playlistGlobal[0].trackInfo.trackUri, userIDGlobal).then(res => {
                        isPlaying = true
                        // player.nextTrack().then(() => {
                        //     console.log('Skipped to next track!');
                        // });
                    })
                }
            }
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

    // useEffect(() => {
    //     if(isPlaying == true) {
    //         fetchUserPlaybackState().then(res => {
    //             console.log("Current user playback information in front-end: ", res)
    //         })
    //     }
    // }, [isPlaying])

    const fetchCallback = () => {
        //get playlist info
        fetchCollaborativePlaylist().then(data => {
            console.log("playlistGlobal: ", playlistGlobal)
            console.log("data: ", data)
            playlistGlobal = data.serverPlaylist;
            console.log("playlistGlobal: ", playlistGlobal)
            setPlaylist(data.serverPlaylist);
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
                    
                    if (position == '0') {
                        console.log("strings")
                    }
                    if (position == 0) {
                        console.log("int")
                        socket.emit('signalPlay', {play : true})
                    }
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

                        // if(current_track.uri != previousTrack && isHost) {
                        //     console.log("Currently removing")
                        //     removeTracks(previousTrack).then(res => {
                        //         console.log("Successfully removed: ", res)

                        //         fetchCollaborativePlaylist().then(data => {
                        //             fetchTracks().then(res => {
                        //                 data.tracks = res
                        //                 setPlaylist(data)
                        //                 playlistGlobal = data
                        //             })
                        //         })
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
                // setInterval(player.getCurrentState().then(state => {
                //     if (!state) {
                //       console.error('User is not playing music through the Web Playback SDK');
                //       return;
                //     }
                //     if (state && !isPlaying) {
                //         if(playlistGlobal) {
                //             console.log("HERE 3.0")
                //             if(isPlaying == false && playlistGlobal.tracks.length > 0 && numberOfUsersMoreThanTwo == true) {
                //                 console.log("HERE 4.0")
                //                 play(playlistGlobal.tracks[0].uri, userIDGlobal).then(res => {
                //                     isPlaying = true
                //                 })
                //             }
                //         }
                //     }
                //     let {
                //       current_track,
                //       next_tracks: [next_track]
                //     } = state.track_window;
                  
                //     console.log('Currently Playing', current_track);
                //     console.log('Playing Next', next_track);
                // }), 100)
            }
        })
    }

    return(
        isMobile == false ? (
            <div className="App">
                <div className="list">
                    <List initSocket={socket} callback={fetchCallback} playlist={playlistGlobal}/>
                    <button className="invite" onClick={() => {
                        alert('http://localhost:8000/')
                    }}>Invite</button>
                </div>
                <Player />
                <Chatbox room={'100'} username={userIDGlobal} initSocket={socket}/>
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