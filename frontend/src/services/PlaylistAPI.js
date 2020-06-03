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

export const play = uri => {
    return fetch('/playPlaylist?trackUri=' + uri, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        return data
    })
    .catch(error => console.log(error))
}

export const addItemsToPlaylist = (trackUri) => {
    return fetch('/addItems?trackUri=' + trackUri, {
        method: 'POST'
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