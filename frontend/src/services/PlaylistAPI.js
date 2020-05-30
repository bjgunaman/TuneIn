// Constants
import { BASE_URL } from '../constants/urls'
import { DEFAULT_ID } from '../constants/id' 

// Creates a collaborative playlist
export const createCollaborativePlaylist = (data) => {
    let url = BASE_URL + '/users/' + DEFAULT_ID + '/playlists'

    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin', 
        headers: {
            'Authorization': '',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json) 
    .then(data => {
        if(data) {
            console.log(data)

            return data
        }
    }) 
}