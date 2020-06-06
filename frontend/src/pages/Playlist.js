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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'


let player = null
let previousTrack = ''
let counter = 0
let playlistGlobal = []
let userIDGlobal = null
let numberOfUsersMoreThanTwo = false
let isHost = false
let currentTrackUri = '';
let previousTrackUri = '';
let position_ms = '';
let currentTrackName = ''
let currentArtistName = ''
let currentAlbumName = ''
let currentDuration = ''
let username = '';
let image = '';


const Playlist = () => {
    const [playlist, setPlaylist] = useState([])
    const [numberOfUsers, setNumberOfUsers] = useState(null)
    const [userID, setUserID] = useState(null)
    const [checkInterval, setCheckInterval] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showChatbox, setShowChatbox] = useState(false)
    const [elapsed, setElapsedTime] = useState(0)
    const socket = io('localhost:8080');

    var searchParams = new URLSearchParams(window.location.search);
    userIDGlobal = searchParams.get("id")
    if(searchParams.get("host") == 'true') {
        console.log("HOST SET")
        isHost = true
    }
    console.log("userIDGlobal: ",userIDGlobal)
    image = searchParams.get("image");
    username = searchParams.get("username");

    useEffect(() => {
        console.log("Fetch playlist")
        setShowChatbox(false)
        setUserID(searchParams.get("id"))

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
                if(numberOfUser.NUM_USERS >= 1 ) {
                    numberOfUsersMoreThanTwo = true
                }
            }
            console.log("TESTING 4.0")
        })
        socket.on('newUserIncoming', (numberOfUser) => {

            console.log("CURRENTNUMBEROFUSER:", numberOfUser.NUM_USERS)
            if (numberOfUsers != numberOfUser.NUM_USERS) {
                setNumberOfUsers(numberOfUser.NUM_USERS)
            }
            console.log("TESTING")
            if(!numberOfUsersMoreThanTwo) {
                if(numberOfUser.NUM_USERS >= 1 ) {
                    numberOfUsersMoreThanTwo = true
                }
            }
            console.log("TESTING 2.0")
            
        })

        socket.on("othersAddItemToQueue", (trackUri) => {
            console.log("Socket client track uri: ", trackUri.trackUri)
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
                                currentTrackName = playlistGlobal[0].trackInfo.trackName;
                                currentArtistName = playlistGlobal[0].trackInfo.artistName.join(' ')
                                currentAlbumName = playlistGlobal[0].trackInfo.albumName
                                currentDuration = playlistGlobal[0].trackInfo.duration

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
                    console.log("Position ms is updated: ", position_ms)
                    setElapsedTime(data.position_ms)
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

    const handleShowChatbox = (choice) => {
        setShowChatbox(choice)
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
                <Player trackName={currentTrackName} artistName={currentArtistName} albumName={currentAlbumName} duration={currentDuration} elapsedTime={elapsed}/>
                <Chatbox image={image} room={'100'} username={username} initSocket={socket}/>
            </div>
        ) : (
            <div className="App">
                {
                    showChatbox ? (
                        <Chatbox image={image} room={'100'} username={username} initSocket={socket} hideChat={() => handleShowChatbox(false)} />
                    ) : null
                }
                <div className="mobile-top-header">
                    <FontAwesomeIcon style={{ marginTop: "2rem" }} className="message-bubble" icon={faCommentAlt} size="3x" onClick={() => {
                        setShowChatbox(true)
                    }}/>
                    <button className="invite" onClick={() => {
                            alert('http://localhost:8000/')
                        }}>Invite</button>
                </div>
                <div className="list">
                    <List initSocket={socket} callback={fetchCallback} playlist={playlistGlobal}/>
                </div>
                <Player duration={currentDuration} elapsedTime={elapsed} trackName={currentTrackName} artistName={currentArtistName} albumName={currentAlbumName} />
            </div> 
        )
    )
}

export default Playlist