// Constants
import { BASE_URL } from '../constants/urls'
import { DEFAULT_ID } from '../constants/id' 

// Creates a collaborative playlist
export const createCollaborativePlaylist = (data) => {
    fetch('/createPlaylist', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
        fetchCollaborativePlaylist();
    })
}

export const fetchCollaborativePlaylist = (data) => {
    fetch('/fetchPlaylist', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
}


export const searchTracks = (query) => {
    fetch('/searchTrack?query=' + query, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => console.log(error))
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
    fetch('/addItems?trackUri=' + trackUri, {
        method: 'POST'
    })
    .then(response => response.json())
    .then( data => {
        console.log(data)
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