const BASE_SPOTIFY_URL = 'https://api.spotify.com/v1'

const express =  require('express');
const request = require('request')
const bodyParser = require('body-parser');
const querystring = require('querystring');

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
let ACCESS_TOKEN_MAP = new Map()
let MASTER_PROFILE = null
let PLAYLIST = null
let PLAYLIST_ID = null
let PLAYLISTINFO = null
let NUM_USERS = 0
var IS_PLAYING = false
let serverPlaylist = []
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

      ACCESS_TOKEN_MAP.set(profile.id, accessToken);
      console.log("Token map: ", ACCESS_TOKEN_MAP)

      if(!MASTER_PROFILE) {
        MASTER_PROFILE = profile
      }

      return done(null, profile);
    });
  })
);

console.log("set up pipeline");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
  strict: false
}));
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
    NUM_USERS += 1

    res.cookie('songs-with-friends', new Date());
    console.log("yuh")
    //console.log(ACCESS_TOKEN)

    if(req.user.id == MASTER_PROFILE.id) {
      res.redirect('/?' + 
      querystring.stringify({
        id: req.user.id,
        host: true
      }))
    } else {
      res.redirect('/?' + 
      querystring.stringify({
        id: req.user.id
      }))
    }
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
      // console.log(body);
      const tracksInfo = body.tracks.items.map(item => {
        return {
          albumName: item.album.name,
          artistName: item.artists.map(artist => artist.name),
          trackId: item.id,
          trackName: item.name,
          trackUri: item.uri,
          duration: item.duration_ms
        }
      })

      res.send(tracksInfo)
      //console.log(tracksInfo);
    } else {
      console.log("Error Search");
      res.send({
        status: 404
      })
    }
  })
})

app.get('/getUserPlaybackState', (req, res) => {
  console.log("Getting user's playback state")
  let uri = BASE_SPOTIFY_URL + '/me/player'
  let getPlaybackOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true,
  }
  
  if(IS_PLAYING == true) {
    request.get(getPlaybackOptions, (error, response, body) => {
      if(!error && response.statusCode === 200) {
        if(!body) {
          res.send(null)
        } else {
          const playbackInfo = body
          // console.log("Playback Info: ", playbackInfo)
          let data = {
            position_ms: playbackInfo.progress_ms,
            trackUri: playbackInfo.uri,
            is_playing: playbackInfo.is_playing,
            status: 200
          }
          
          // console.log("DATA FROM USER PLAYBACK", data)
          res.send(data)
        }
      } else {
        console.log(error)
        res.send(error)
      }
    })  
  } else {
    res.send({
      status: 404
    })
  }
})

app.put('/playPlaylist', (req, res) => {
  console.log('playing playlist', req.query)
  //const playlistUri = PLAYLIST.uri
  let uri  = BASE_SPOTIFY_URL + '/me/player/play'
  let data = {
    // context_uri: PLAYLIST.uri,
    // offset: {
    //   uri: req.query.trackUri
    // }
    uris: [req.query.trackUri],
    position_ms: 0
  }
  let playOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN_MAP.get(req.query.user_id) },
    json: true,
    body: data
  }
  request.put(playOptions, (error, response, body) => {
    // console.log("Play response in server: ", response)
    if(!error && response.statusCode === 204) {
      console.log("Play response: ", response)
      IS_PLAYING = true
      res.send({
        status: 204
      })
    } else {
      console.log(error)
      res.send({
        status: 404
      })
    }
  })
})

app.get('/fetchTracks', (req, res) => {
  console.log('Fetching Tracks')

  let uri  = BASE_SPOTIFY_URL + '/playlists/' + PLAYLIST.id + '/tracks'

  let tracksGetOption = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true
  }

  request.get(tracksGetOption, (error, response, body) => {
    if(!error && response.statusCode === 200) {
      let playlistTracks =  body.items.map(item => {
        return {
          albumName: item.track.album.name,
          artistName: item.track.artists.map(artist => artist.name),
          trackId: item.track.id,
          trackName: item.track.name,
          trackUri: item.track.uri,
          duration: item.track.duration_ms
        }
      })

      res.send(playlistTracks) 
    } else {
      console.log("Error GET tracks")
      res.send({
        status: 404
      })
    }
  })
})

app.get('/fetchPlaylist', (req, res) => {
  console.log("fetching playlist");
  res.send({ serverPlaylist });

})

app.get('/fetchNumberofUsers', (req, res) => {
  res.send({
    num_user: NUM_USERS
  })
})

app.delete('/removeItems', (req, res) => {
  serverPlaylist.shift();
  res.send({serverPlaylist});
})
app.post('/addItems', (req, res) => {
  console.log("adding Items");
  console.log(req.body);
  const trackInfo = req.body;
  console.log("TRACK INFO", trackInfo);
  serverPlaylist.push(trackInfo);
  console.log("SERVER PLAYLIST", serverPlaylist);
  res.send({ serverPlaylist });
})

app.post('/addToQueue', (req, res) => {
  console.log("Adding to queue in server")
  console.log("Track URI: ", req.query.trackUri)
  let uri = BASE_SPOTIFY_URL + '/me/player/queue?uri=' + req.query.trackUri

  let addToQueueOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN_MAP.get(req.query.user_id) },
    json: true,
  }

  request.post(addToQueueOptions, (error, response, body) => {
    console.log("Successfully added to queue")
    // console.log("Response of add to queue: ", response)

    if(!error && response.statusCode == 204) {
      console.log("Successfully added to queue 2")

      res.send({
        statusCode: response.statusCode
      })
    } else {
      console.log(error);
      console.log("Error add to queue")
      res.send({
        status: 404
      })
    }
  }) 
})

app.get('/fetchAccessToken', (req, res) => {
  console.log("User access tokens: ", ACCESS_TOKEN_MAP)
  console.log("User access token in fetchAccessToken: ", req.query.user_id)
  res.send({
    access_token: ACCESS_TOKEN_MAP.get(req.query.user_id)
  })
})

app.get('/fetchPlaylistUri', (req, res) => {
  res.send({
    playlist_uri: PLAYLIST.uri
  })
})

app.get('/fetchUserCurrPlaying', (req, res) => {
  console.log("fetching Master's currently playing track")
  let uri = BASE_SPOTIFY_URL + '/me/player/currently-playing'

  let fetchUserCurrPlayingOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true,
  }

  request.get(fetchUserCurrPlayingOptions, (error, response, body) => {
    console.log("Fetched User currently playing Track")
    console.log("Successfully update playback: ", response.statusCode)

    if(!error && (response.statusCode == 204 || response.statusCode == 200)) {

      if(response.statusCode == 200) {
        res.send({
          statusCode: response.statusCode,
          position_ms: body.progress_ms,
          uri: body.uri,
          is_playing: body.is_playing
        })
      } else {
        res.send({
          statusCode: response.statusCode
        })
      }
    } else {
      console.log(error);
      console.log("Error get user playback")
      res.send({
        status: 404
      })
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
        console.log("emitting to room");
        socket.broadcast.to(userInfo.room).emit('serverMessage', { username: 'server', textMessage: `${userInfo.username} has joined the channel`});
        socket.broadcast.to(userInfo.room).emit('newUserIncoming', { NUM_USERS });
        socket.join(userInfo.room);
        console.log("joining");      
    });
    socket.on('getNumberOfUsers', () => {
      console.log("RECEIVE USER REQUEST");
      socket.emit('receiveNumberOfUsers', { NUM_USERS });
    });
    socket.on("addItemToPlaylist", (trackInfo) => {
      // const userInfo = userMap.get(socket.id);
      console.log("Socket server track uri: ", trackInfo)
      socket.broadcast.to('100').emit("othersAddItemToQueue", trackInfo);
      console.log("EMITTING");
      io.to('100').emit("toPlay", trackInfo);
      console.log("EMITTED")
    })
    socket.on('sendMessage', (message) => {
        const userInfo = userMap.get(socket.id);
        console.log(message);
        console.log(userInfo);
        io.to(userInfo.room).emit('broadcastedMessage', {username: userInfo.username, textMessage: message});
    });
    socket.on('signalPlay', (play) => {
      socket.broadcast.to('100').emit('pleasePlay', play);
    });
    socket.on('addSongsFetchNew', () => {
      socket.broadcast.to('100').emit('pleaseFetch');
    })
    socket.on('disconnect-user', () => {
        const userInfo = userMap.get(socket.id);
        if(userInfo) {
            userMap.delete(socket.id);
            io.to(userInfo.room).emit('serverMessage', {message: `${user.name} has left`});
        }
    })
});

