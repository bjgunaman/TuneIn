import Chatbox from './components/Chatbox'
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
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/playlist">
          <Playlist />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
