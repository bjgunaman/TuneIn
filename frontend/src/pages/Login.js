import React from 'react'

// Styles
import '../styles/Login.css'

const Login = () => {
    const authenticate = () => {
        fetch("auth/spotify").then((response) => {
          console.log(response);
        })
    }
    return(
        <div>
            <div>
                <h1 className="title">TuneIn (a Songs with Friends project)</h1>
            </div>
            <div className="row">
              {/* <a href="auth/spotify"> */}
                <button className="login" onClick={e => authenticate()}>CONNECT TO SPOTIFY</button>
              {/* </a> */}
            </div>
        </div>
    )
}

export default Login