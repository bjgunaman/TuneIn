import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

// Pages
import Login from './pages/Login'
import Playlist from './pages/Playlist'

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/playlist">
          <Playlist />
        </Route>
      </Switch>
      {      
        isLoggedIn ? 
        <Redirect
          to={{
            pathname: "/playlist"
          }}
        /> : 
        <Redirect
          to={{
            pathname: "/login"
          }}
        />
      }
    </Router>
  );
}

export default App;
