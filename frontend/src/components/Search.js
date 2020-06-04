import React, { useState, useEffect } from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import '../styles/Search.css'
import { searchTracks, addItemsToPlaylist, postAddToQueue } from '../services/PlaylistAPI';

const Search = props => {
    const [track, setTrack] = useState('')
    const [searchResult, setSearchResult] = useState([])

    useEffect(() => {
    }, [])

    const handleSearch = () => {
        searchTracks(track).then(res => {
            setSearchResult(res)
        })
    }

    const handleAdd = (uri) => {
        addItemsToPlaylist(uri).then(res => {
            console.log("Snapshot id: ", res)
            postAddToQueue(uri).then(res => {
                console.log("Add to queue front-end: ", res)
            })
            props.callback()
            props.handle()
        })
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <FontAwesomeIcon className="edit" size="2x" icon={faTimes} onClick={props.handle}/>
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
                        <table style={{ marginTop: "2rem", overflowY: "scroll", height: "200px", display: "block" }}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Album</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    searchResult.map(({ albumName, artistName, trackName, trackUri }) => {
                                        return([
                                            <tr className="song-row">
                                                <td>{trackName}</td>
                                                <td>{artistName}</td>
                                                <td>{albumName}</td>
                                                <button className="add-button" onClick={() => {handleAdd(trackUri)}}>Add</button>
                                            </tr>
                                        ])
                                    })
                                }
                            </tbody>
                        </table>
                    ) : null
                }
            </div>
        </div>
    );
};

export default Search;