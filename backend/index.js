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


var appKey = '7f6407d2ff194a87a5236a464044ec4e';
var appSecret = '040e7b594df34f578a39875342e941bf';
var ACCESS_TOKEN = null
var MASTER_PROFILE = null

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
    console.log(ACCESS_TOKEN)
    res.redirect('/')
  }
);

// Commented this bit out because it wouldn't go to the auth page
// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../frontend/build/index.html'));
});

// ENDPOINTS
app.get('/fetchPlaylist', (req, res) => {

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
    if(!error && response.statusCode == 200) {
      console.log("Successfully created playlist")
      console.log("Body: ", body)
    } else {
      console.log("Error Auth")
    }
  })
})

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