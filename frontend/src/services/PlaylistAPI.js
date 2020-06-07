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
        return data
    })
}

export const searchTracks = (query) => {
    return fetch('/searchTrack?query=' + query, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
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
        return response.json()
    })
    .then(data => {
        return data
    })
    .catch(error => console.log(error))
}

export const addItemsToPlaylist = (trackInfo) => {
    return fetch('/addItems?trackUri=' + trackInfo.trackUri + '&trackName=' + trackInfo.trackName + '&albumName=' + trackInfo.albumName + '&artistName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({trackInfo: trackInfo})
    })
    .then(response => response.json())
    .then( data => {
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
        return data
    })
}

export const fetchUserPlaybackState = () => {
    return fetch('/getUserPlaybackState', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
}

export const fetchNumberofUsers = () => {
    return fetch('/fetchNumberofUsers', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
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