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
}

export const fetchUserData = () => {
    
}