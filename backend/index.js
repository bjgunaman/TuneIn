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

      res.send(tracksInfo)
      //console.log(tracksInfo);
    } else {
      console.log("Error Search");
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
  request.get(getPlaybackOptions, (error, response, body) => {
    if(!error && response.statusCode === 200) {
      const playbackInfo = body
      let data = {
        position_ms: playbackInfo.item.progress_ms,
        context_uri: playbackInfo.item.context.uri,
        trackUri: playbackInfo.item.uri,
        is_playing: playbackInfo.item.is_playing
      }
      console.log("DATA FROM USER PLAYBACK", data)
      res.send(data)
    } else {
      console.log(error)
      res.send(error)
    }
  })
})

app.put('/playPlaylist', (req, res) => {
  console.log('playing playlist')
  const playlistUri = PLAYLIST.uri
  let uri  = BASE_SPOTIFY_URL + '/me/player/play'
  let data = {
    "context_uri": PLAYLIST.uri,
    offset: {
      uri: req.trackUri
    },
    position_ms: req.position_ms
  }
  let playOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true,
    body: data
  }
  request.put(playOptions, (error, response, body) => {
    if(!error && response.statusCode === 204) {
      const play = body
      console.log(play)
      res.send({})
    } else {
      console.log(error)
      res.send(error)
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

  if(PLAYLIST == null) {
    res.send({
      status: 404
    })
  } else {
    request.get(playlistGetOptions, (error, response, body) => {
      //console.log(response)
      if(!error && response.statusCode === 200) {
        PLAYLISTINFO = body.items.filter(item => item.id === PLAYLIST_ID);
        console.log("Playlist Info: ", PLAYLISTINFO)
        PLAYLIST_ID = PLAYLISTINFO[0].id
        console.log(PLAYLIST_ID)
        console.log("Successfully Got playlist")
        //console.log(PLAYLISTINFO);
  
        PLAYLIST = PLAYLISTINFO[0]
        
        let playlist = {
          status: 200,
          uri: PLAYLIST.uri,
          name: PLAYLIST.name,
          id: PLAYLIST.id
        }
  
        res.send(playlist) 
      } else {
        console.log("Error GET")
      }
    })
  }
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
    // console.log(response)
    if(!error && response.statusCode == 201) {
      PLAYLIST = response.body
      PLAYLIST_ID = PLAYLIST.id
      console.log("Successfully created playlist")
      //console.log("Body: ", body)

      let playlist = {
        status: 200,
        uri: PLAYLIST.uri,
        name: PLAYLIST.name,
        id: PLAYLIST.id
      }

      res.send(playlist) 
    } else {
      console.log("Error Auth")
    }
  })
})

app.delete('/removeItems', (req, res) => {
  console.log('removing items');
  let uri  = BASE_SPOTIFY_URL + '/playlists/5eJ54SA1Kz4UbWtgMqKddc/tracks'//uris=spotify:track:5lzZpz0vA73lljqFPpXSXP'
  console.log(uri)
  let spotifyUri = 'spotify:track:5IzZpz0vA73IIjqFPpXSXP' //req.query.trackUri
  let removeItemOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    'Content-type': 'application/json',
    json: true,
    body: {
      tracks: [{
        uri: spotifyUri,
        positions: [0]
      }]
    }
  }
  request.delete(removeItemOptions, (error, response, body) => {
    console.log(response)
    if(!error && response.statusCode === 200) {
      const snapshot_id = body
      console.log("Successfully removed from playlist")
      console.log("snapshot_id ", snapshot_id)
    } else {
      console.log(error);
      console.log("Error removing from playlist")
    }
  })
})
app.post('/addItems', (req, res) => {
  console.log("adding Items");
  let uri  = BASE_SPOTIFY_URL + '/playlists/' + PLAYLIST_ID + '/tracks?uris=' + req.query.trackUri
  console.log(uri);
  let addItemOptions = {
    url: uri,
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN },
    json: true,
  }

  request.post(addItemOptions, (error, response, body) => {
    //console.log(response)
    if(!error && response.statusCode == 201) {
      const snapshot_id = body
      console.log("Successfully added to playlist")
      res.send(snapshot_id)
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

/**
 * WITH ALBUM 
 * We need: track.album.name, track.artists.name, track.name, track.id, track.uri
 * 
 * {
      "added_at": "2020-02-01T03:21:35Z",
      "added_by": {
        "external_urls": {
          "spotify": "https://open.spotify.com/user/nicholassteven998"
        },
        "href": "https://api.spotify.com/v1/users/nicholassteven998",
        "id": "nicholassteven998",
        "type": "user",
        "uri": "spotify:user:nicholassteven998"
      },
      "is_local": false,
      "primary_color": null,
      "track": {
        "album": {
          "album_type": "album",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60"
              },
              "href": "https://api.spotify.com/v1/artists/246dkjvS1zLTtiykXe5h60",
              "id": "246dkjvS1zLTtiykXe5h60",
              "name": "Post Malone",
              "type": "artist",
              "uri": "spotify:artist:246dkjvS1zLTtiykXe5h60"
            }
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/4g1ZRSobMefqF6nelkgibi"
          },
          "href": "https://api.spotify.com/v1/albums/4g1ZRSobMefqF6nelkgibi",
          "id": "4g1ZRSobMefqF6nelkgibi",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/ab67616d00001e029478c87599550dd73bfa7e02",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/ab67616d000048519478c87599550dd73bfa7e02",
              "width": 64
            }
          ],
          "name": "Hollywood's Bleeding",
          "release_date": "2019-09-06",
          "release_date_precision": "day",
          "total_tracks": 17,
          "type": "album",
          "uri": "spotify:album:4g1ZRSobMefqF6nelkgibi"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60"
            },
            "href": "https://api.spotify.com/v1/artists/246dkjvS1zLTtiykXe5h60",
            "id": "246dkjvS1zLTtiykXe5h60",
            "name": "Post Malone",
            "type": "artist",
            "uri": "spotify:artist:246dkjvS1zLTtiykXe5h60"
          }
        ],
        "disc_number": 1,
        "duration_ms": 215280,
        "episode": false,
        "explicit": false,
        "external_ids": {
          "isrc": "USUM71915699"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/21jGcNKet2qwijlDFuPiPb"
        },
        "href": "https://api.spotify.com/v1/tracks/21jGcNKet2qwijlDFuPiPb",
        "id": "21jGcNKet2qwijlDFuPiPb",
        "is_local": false,
        "name": "Circles",
        "popularity": 93,
        "preview_url": "https://p.scdn.co/mp3-preview/9cb3c8b7ccb399c2c5346ac424cc59be9fef3c98?cid=774b29d4f13844c495f206cafdad9c86",
        "track": true,
        "track_number": 6,
        "type": "track",
        "uri": "spotify:track:21jGcNKet2qwijlDFuPiPb"
      },
      "video_thumbnail": {
        "url": null
      }
    }

    SINGLE
    We need: 

    {
      "added_at": "2020-02-01T03:21:13Z",
      "added_by": {
        "external_urls": {
          "spotify": "https://open.spotify.com/user/nicholassteven998"
        },
        "href": "https://api.spotify.com/v1/users/nicholassteven998",
        "id": "nicholassteven998",
        "type": "user",
        "uri": "spotify:user:nicholassteven998"
      },
      "is_local": false,
      "primary_color": null,
      "track": {
        "album": {
          "album_type": "single",
          "artists": [
            {
              "external_urls": {
                "spotify": "https://open.spotify.com/artist/04gDigrS5kc9YWfZHwBETP"
              },
              "href": "https://api.spotify.com/v1/artists/04gDigrS5kc9YWfZHwBETP",
              "id": "04gDigrS5kc9YWfZHwBETP",
              "name": "Maroon 5",
              "type": "artist",
              "uri": "spotify:artist:04gDigrS5kc9YWfZHwBETP"
            }
          ],
          "external_urls": {
            "spotify": "https://open.spotify.com/album/3nR9B40hYLKLcR0Eph3Goc"
          },
          "href": "https://api.spotify.com/v1/albums/3nR9B40hYLKLcR0Eph3Goc",
          "id": "3nR9B40hYLKLcR0Eph3Goc",
          "images": [
            {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b273b8c0135a218de2d10a8435f5",
              "width": 640
            },
            {
              "height": 300,
              "url": "https://i.scdn.co/image/ab67616d00001e02b8c0135a218de2d10a8435f5",
              "width": 300
            },
            {
              "height": 64,
              "url": "https://i.scdn.co/image/ab67616d00004851b8c0135a218de2d10a8435f5",
              "width": 64
            }
          ],
          "name": "Memories",
          "release_date": "2019-09-20",
          "release_date_precision": "day",
          "total_tracks": 1,
          "type": "album",
          "uri": "spotify:album:3nR9B40hYLKLcR0Eph3Goc"
        },
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/04gDigrS5kc9YWfZHwBETP"
            },
            "href": "https://api.spotify.com/v1/artists/04gDigrS5kc9YWfZHwBETP",
            "id": "04gDigrS5kc9YWfZHwBETP",
            "name": "Maroon 5",
            "type": "artist",
            "uri": "spotify:artist:04gDigrS5kc9YWfZHwBETP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 189486,
        "episode": false,
        "explicit": false,
        "external_ids": {
          "isrc": "USUM71913350"
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2b8fOow8UzyDFAE27YhOZM"
        },
        "href": "https://api.spotify.com/v1/tracks/2b8fOow8UzyDFAE27YhOZM",
        "id": "2b8fOow8UzyDFAE27YhOZM",
        "is_local": false,
        "name": "Memories",
        "popularity": 91,
        "preview_url": "https://p.scdn.co/mp3-preview/d7527c763d2a23c25299a886ad161ffaad6294e3?cid=774b29d4f13844c495f206cafdad9c86",
        "track": true,
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:2b8fOow8UzyDFAE27YhOZM"
      },
      "video_thumbnail": {
        "url": null
      }
    }
 * 
 */

