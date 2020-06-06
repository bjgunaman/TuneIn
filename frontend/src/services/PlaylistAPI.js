// Constants
import { BASE_URL } from '../constants/urls'
import { DEFAULT_ID } from '../constants/id' 

// Creates a collaborative playlist
export const createCollaborativePlaylist = () => {
    return fetch('/createPlaylist', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.log(error)
    })
}

export const fetchCollaborativePlaylist = () => {
    return fetch('/fetchPlaylist', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Playlist data: ", data)

        if (data.status == 404) {
            return data.status
        } else {
            return data
        }
    })
    .catch(error => {
        console.log(error)
        return error
    })
}

export const fetchTracks = () => {
    return fetch('/fetchTracks', {
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        console.log("Playlist tracks: ", data)
        
        return data
    })
}

export const searchTracks = (query) => {
    return fetch('/searchTrack?query=' + query, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => {
        console.log(error)
        return error
    })
}

export const play = (uri, user_id) => {
    return fetch('/playPlaylist?trackUri=' + uri + '&user_id=' + user_id, {
        method: 'PUT'
    })
    .then(response => {
        console.log("Play response: ", response)
        return response.json()
    })
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => console.log(error))
}
//{albumName: "7 EP", artistName: Array(2), trackName: "Old Town Road - Remix", trackUri: "spotify:track:2YpeDb67231RjR0MgVLzsG"}
export const addItemsToPlaylist = (trackInfo) => {
    console.log("trackInfo: ",trackInfo);
    return fetch('/addItems?trackUri=' + trackInfo.trackUri + '&trackName=' + trackInfo.trackName + '&albumName=' + trackInfo.albumName + '&artistName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({trackInfo: trackInfo})
    })
    .then(response => response.json())
    .then( data => {
        console.log(data)
        return data
    }).catch(error => {
        console.log(error)
        return error
    })
}

export const removeItemFromPlaylist = (trackUri) => {
    return fetch('/removeItems?trackUri=' + trackUri, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then( data => {
        console.log(data)
    })
}

export const fetchUserPlaybackState = () => {
    return fetch('/getUserPlaybackState', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetch user playback state: ", data)
        return data
    })
}

export const fetchNumberofUsers = () => {
    return fetch('/fetchNumberofUsers', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Number of users: ", data)
        return data
    })
}

export const removeTracks = () => {
    return fetch('/removeItems', {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
}

export const fetchAccessToken = (user_id) => {
    return fetch('/fetchAccessToken?user_id=' + user_id, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
}

export const fetchPlaylistUri = () => {
    return fetch('/fetchPlaylistUri', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
}

export const playPlayer = ({ 
    playlist_uri, 
    trackUri,
    playerInstance: {
    _options: {
        getOAuthToken,
        id
    }
  } }) => {
    getOAuthToken(access_token => {
        console.log(access_token)
        fetch('https://api.spotify.com/v1/me/player/play?device_id=' + id, {
            method: 'PUT',
            body: JSON.stringify({ 
               uri: [trackUri]
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },
        })
        .then(response => {
            console.log("Player error response: ", response)
        })
    })
    
}

export const postAddToQueue = (uri, user_id) => {
    return fetch('/addToQueue?trackUri=' + uri + '&user_id=' + user_id, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
}

export const fetchUserCurrPlayingTrack = () => {
    return fetch('/fetchUserCurrPlaying')
    .then(response => response.json())
    .then(data => {
        return data
    })
}