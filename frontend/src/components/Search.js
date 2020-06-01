import React, { useState, useEffect } from 'react';

import '../styles/Search.css'

const Search = () => {
    const [track, setTrack] = useState('')
    const [searchResult, setSearchResult] = useState([])

    useEffect(() => {
        setSearchResult([
            {
                albumName: "Test Album 1",
                trackName: "Test Track 1",
                artistName: "Test Artist 1",
            },
            {
                albumName: "Test Album 2",
                trackName: "Test Track 2",
                artistName: "Test Artist 2",
            },
            {
                albumName: "Test Album 3",
                trackName: "Test Track 3",
                artistName: "Test Artist 3",
            }
        ])

    }, [searchResult])

    return (
        <div className="popup">
            <div className="popup-inner">
                <h1 style={{ fontWeight: 600 }}>Add Songs to Queue</h1>
                <div className="search">
                    <input
                        className="search-box" 
                        onChange={(e) => setTrack(e.target.value)}
                        value={track} 
                        placeholder="Search by title, artist, or album"
                    ></input>
                    <div className="search-pop-up">Search</div>
                </div>
                {
                        searchResult ? (
                            <table style={{ marginTop: "2rem" }}>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Artist</th>
                                        <th>Album</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        searchResult.map(({ albumName, artistName, trackName }) => {
                                            return([
                                                <tr>
                                                    <td>{trackName}</td>
                                                    <td>{artistName}</td>
                                                    <td>{albumName}</td>
                                                    <button className="add-button">Add</button>
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