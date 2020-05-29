import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

// Pages
import Login from './pages/Login'
import Playlist from './pages/Playlist'

import './App.css';

function App() {
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
      <Redirect
        to={{
          pathname: "/login"
        }}
      />
    </Router>
  );
}

export default App;
