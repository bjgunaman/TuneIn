const BASE_SPOTIFY_URL = 'https://api.spotify.com/v1'

const express =  require('express');
const request = require('request')
const bodyParser = require('body-parser');

const passport = require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy;

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const app = express()
const http = require('http');

const server = http.createServer(app);
const io = socketio(server);

let userMap = new Map();


let appKey = '7f6407d2ff194a87a5236a464044ec4e';
let appSecret = '040e7b594df34f578a39875342e941bf';
let ACCESS_TOKEN = null
let MASTER_PROFILE = null
let PLAYLIST = null
let PLAYLIST_ID = null
let PLAYLISTINFO = null

passport.serializeUser(function(user, done) {
	done(null, user);
})

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Spotify strategy
passport.use(
	new SpotifyStrategy({
		clientID: appKey,
		clientSecret: appSecret,
		callbackURL: 'http://localhost:8000/auth/spotify/callback',
	},
	function(accessToken, refreshToken, expires_in, profile, done) {
		process.nextTick(function() {
      // console.log("Got profile: ", profile);
      if(!ACCESS_TOKEN) {
        ACCESS_TOKEN = accessToken
      }

      if(!MASTER_PROFILE) {
        MASTER_PROFILE = profile
      }

      return done(null, profile);
    });
  })
);

console.log("set up pipeline");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(expressSession({
  secret:'cookieCat',
  maxAge: 6 * 60 * 60 * 1000,
  resave: true,
  saveUninitialized: false,
  name: "tunein-session-cookie"
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static('../frontend/src/pages/*'));

app.get('/auth/spotify', passport.authenticate('spotify', {
  scope: 'user-read-private playlist-modify playlist-modify-public playlist-modify-private playlist-read-collaborative user-read-email streaming user-modify-playback-state user-read-currently-playing user-read-playback-state user-read-playback-position',
  showDialog: true
}),
  function(req, res) {}
);

app.get('/auth/spotify/callback',
  passport.authenticate('spotify',
    { successRedirect: '/setcookie', failureRedirect: '/' }
  ),
);

app.get('/setcookie', requireUser,
  function(req, res) {
    res.cookie('songs-with-friends', new Date());
    console.log("yuh")
    //console.log(ACCESS_TOKEN)
    res.redirect('/')
  }
);

app.get('/searchTrack', (req,res) => {
  console.log("searchTrack");
  const userQuery = req.query.query
  let uri  = BASE_SPOTIFY_URL + '/search?query=' + userQuery + '&type=track';
  let searchOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true
  }
  request.get(searchOptions, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      console.log(body);
      const tracksInfo = body.tracks.items.map(item => {
        return {
          albumName: item.album.name,
          artistName: item.artists.map(artist => artist.name),
          trackId: item.id,
          trackName: item.name,
          trackUri: item.uri
        }
      })
      //console.log(tracksInfo);
    } else {
      console.log("Error Search");
    }
  })
})

app.put('/play', (req, res) => {
  console.log('play')
  const playlistUri = PLAYLIST.uri
  let uri  = BASE_SPOTIFY_URL + '/search?query=' + userQuery + '&type=track';
  let searchOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true
  }
  request.put(searchOptions, (error, response, body) => {
    if(!error && response.statusCode === 200) {
      const play = body
      console.log(play)
    } else {
      console.log(error)
    }
  })
})

app.get('/fetchPlaylist', (req, res) => {
  console.log("fetching playlist")
  console.log(MASTER_PROFILE.id)
  let uri = BASE_SPOTIFY_URL + '/users/' + MASTER_PROFILE.id + '/playlists'
  let playlistGetOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true
  }

  request.get(playlistGetOptions, (error, response, body) => {
    //console.log(response)
    if(!error && response.statusCode === 200) {
      PLAYLISTINFO = body.items.filter(item => item.name === 'Squad Playlist');
      PLAYLIST_ID = PLAYLISTINFO[0].id
      console.log(PLAYLIST_ID)
      console.log("Successfully Got playlist")
      //console.log(PLAYLISTINFO);
      
    } else {
      console.log("Error GET")
    }
  })
})

app.post('/createPlaylist', (req, res) => {
  console.log("Master profile: ", MASTER_PROFILE)

  let uri = BASE_SPOTIFY_URL + '/users/' + MASTER_PROFILE.id + '/playlists'
  let data = {
    name: "Squad Playlist",
    public: false,
    collaborative: true,
    description: ""
  }

  console.log(JSON.stringify(data))

  let playlistOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true,
    body: data
  }

  request.post(playlistOptions, (error, response, body) => {
    console.log(response)
    if(!error && response.statusCode == 201) {
      PLAYLIST = response.body
      console.log("Successfully created playlist")
      //console.log("Body: ", body)
    } else {
      console.log("Error Auth")
    }
  })
})

app.post('/addItems', (req, res) => {
  console.log("adding Items");
  let uri  = BASE_SPOTIFY_URL + '/playlists/' + PLAYLIST_ID + '/tracks?uris=' + req.query.songUri
  console.log(uri);
  let addItemOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true,
  }

  request.post(addItemOptions, (error, response, body) => {
    //console.log(response)
    console.log(response);
    if(!error && response.statusCode == 201) {
      const snapshot_id = body
      console.log("Successfully added to playlist")
      //console.log("Body: ", body)
    } else {
      console.log(error);
      console.log("Error add to playlist")
    }
  })
})

// Commented this bit out because it wouldn't go to the auth page
// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});

// ENDPOINTS


// Don't need this yet
// app.get('/auth/logout', (req, res) => {
//   console.log("logging out");
//   res.redirect('/');  
// });

function requireUser(req, res, next) {
  if(!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

function requireLogin(req, res, next) {
  if(!req.cookies['tunein-session-cookie']) {
    res.redirect('/');
  } else {
    next();
  }
};

const port = process.env.PORT || 8000;
server.listen(8080, () => console.log('listening on port 8080'));
app.listen(port);

console.log('App is listening on port ' + port);

io.on('connection', (socket) => {
    console.log('We have a new connection!!!');
    socket.on('joining', (userInfo) => {
        userMap.set(socket.id, {username: userInfo.username, room: userInfo.room});
        //socket.emit('message', {user: 'admin', text: `${user.name}, welcome to this chat room!`});
        socket.join(userInfo.room);
        socket.broadcast.to(userInfo.room).emit('serverMessage', { username: 'server', textMessage: `${userInfo.username} has joined the channel`});
        console.log("joining")
        
    });
    socket.on('sendMessage', (message) => {
        const userInfo = userMap.get(socket.id);
        console.log(message);
        console.log(userInfo);
        io.to(userInfo.room).emit('broadcastedMessage', {username: userInfo.username, textMessage: message});
    });
    socket.on('disconnect-user', () => {
        const userInfo = userMap.get(socket.id);
        if(userInfo) {
            userMap.delete(socket.id);
            io.to(userInfo.room).emit('serverMessage', {message: `${user.name} has left`});
        }
    })
});


