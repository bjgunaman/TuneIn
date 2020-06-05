import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

// Styles
import '../styles/Login.css'

const Login = props => {
  const[spotifyCookie, setSpotifyCookie] = useState(null)

  useEffect(() => {
    if(spotifyCookie) {
      props.history.replace('/playlist' + window.location.search)
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
      <div className="login-row">
          <div className="tops">
            <p className="top-bar" style={{ display: "flex", flexDirection: "row-reverse" }}>Login</p>
            <hr style={{ width: "90vw" }}></hr>
          </div>
          <div class="main-login">
            <div>
                <h1 className="title">Welcome to Songs With Friends</h1>
                <p className="subtitle">Sit back, relax, and let your friends </p>
            </div>
            <div>
              <a href="auth/spotify">
                <button className="login">Login With Spotify</button>
              </a>
            </div>
          </div>
      </div>
    ) 
  )
      
}

export default withRouter(Login)