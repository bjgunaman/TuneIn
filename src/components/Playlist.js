import React, { useState, useEffect } from 'react'

const Playlist = () => {
    const[playlist, setPlaylist] = useState([])
    useEffect(() => {
        let samplePlaylist = [
            {
                title: "Hello World",
                artist:  "John Doe",
                album: "It's a Hello World",
                duration: "3:20"
            }
        ]

        setPlaylist(samplePlaylist)
    }, [])

    return(
        <div>
            <div>
                <h1>Squad Playlist</h1>
            </div>
            <div>
                {
                    playlist.map(({ title, artist, album, duration }) => {
                        return([
                            <div>
                                 <p>{title}</p>
                                <p>{artist}</p>
                                <p>{album}</p>
                                <p>{duration}</p>
                            </div>
                        ])
                    })
                }
            </div>
        </div>
    )
}

export default Playlist