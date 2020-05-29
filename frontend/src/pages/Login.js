import React from 'react'

// Styles
import '../styles/Login.css'

const Login = () => {
    return(
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
}

export default Login