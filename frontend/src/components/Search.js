import React, { useState, useEffect } from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

import '../styles/Search.css'
import { searchTracks, addItemsToPlaylist, postAddToQueue } from '../services/PlaylistAPI';

const Search = props => {
    const [track, setTrack] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const socket = props.initSocket;
    useEffect(() => {
        
    }, [])

    const handleSearch = () => {
        searchTracks(track).then(res => {
            setSearchResult(res)
            console.log("RES:", res)
        })
    }

    const handleAdd = (trackInfo) => {
        addItemsToPlaylist(trackInfo).then(res => {
            console.log("Snapshot id: ", res)
            socket.emit("addSongsFetchNew")
            props.callback()
            props.handle()
        })
        socket.emit("addItemToPlaylist", { trackInfo: trackInfo })
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <FontAwesomeIcon className="edit" size="2x" icon={faTimes} onClick={props.handle} style={{ marginTop: "1rem"}}/>
                <h1 style={{ fontWeight: 600 }}>Add Songs to Queue</h1>
                <div className="search">
                    <input
                        className="search-box" 
                        onChange={(e) => setTrack(e.target.value)}
                        value={track} 
                        placeholder="Search by title, artist, or album"
                    ></input>
                    <div onClick={() => {handleSearch()}} className="search-pop-up">Search</div>
                </div>
                {
                    searchResult ? (
                        <table style={{ marginTop: "2rem", overflowY: "scroll", height: "240px", display: "block" }}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Album</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    searchResult.map(({ albumName, artistName, trackName, trackUri, duration }) => {
                                        return([
                                            <tr className="song-row">
                                                <td>{trackName}</td>
                                                <td>{artistName}</td>
                                                <td>{albumName}</td>
                                                <button className="add-button" onClick={() => {handleAdd({ albumName, artistName, trackName, trackUri, duration })}}>Add</button>
                                            </tr>
                                        ])
                                    })
                                }
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-search-result">
                            <FontAwesomeIcon style={{ opacity: 0.6 }} icon={faSearch} size={"6x"}/>
                            <p style={{ opacity: 0.7 }}>No results to show...yet</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Search;