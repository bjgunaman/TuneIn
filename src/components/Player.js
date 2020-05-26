import React from 'react'

// Styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'

import '../styles/Player.css'

const Player = (props) => {
    return(
        <div className="player">
            <div>
                <p>Currently Playing: </p>
            </div>
            <div className="lower">
                <FontAwesomeIcon className="volume-up" icon={faVolumeUp} size="2x" />
                <FontAwesomeIcon className="volume-mute" icon={faVolumeMute} size="2x" />
            </div>
        </div>
    )
}

export default Player