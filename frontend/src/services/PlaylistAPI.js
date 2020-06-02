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

export const play = () => {
    fetch('/play', {
        method: 'PUT',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
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
    fetch('/removeItems?trackUri=' + trackUri, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then( data => {
        console.log(data)
    })
}
export const fetchUserData = () => {
    
}