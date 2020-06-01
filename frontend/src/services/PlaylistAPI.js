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
    .then(response => console.log(response))
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
}

export const fetchUserData = () => {
    
}