import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

// Styles
import '../styles/Login.css'

const Login = props => {
  const[spotifyCookie, setSpotifyCookie] = useState(null)

  useEffect(() => {
    if(spotifyCookie) {
      props.history.replace('/playlist')
    } else {
      try {
        const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('songs-with-friends'))
        .split('=')[1]
    
        setSpotifyCookie(cookieValue)
      } catch {
        console.log("No Cookies")
      }
    }
    
  }, [spotifyCookie])

  return(
    spotifyCookie ? (
      <div>
        <p>Loading...</p>
      </div>
    ) : (
      <div>
          <div>
              <h1 className="title">TuneIn (a Songs with Friends project)</h1>
          </div>
          <div className="row">
            <a href="auth/spotify">
              <button className="login">CONNECT TO SPOTIFY</button>
            </a>
          </div>
      </div>
    ) 
  )
      
}

export default withRouter(Login)