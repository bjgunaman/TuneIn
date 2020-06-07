# Group TuneIn (Songs with Friends)

### Members
Brandon Jones Gunaman, SID: 914175607
Nicholas Steven Darmawan, SID: 914004587
Raylph Evangelista, SID: 913184220

# How to build and run the app

### Building the front-end
1. `cd ./frontend` (move to the front-end directory) on project root
2. Run `npm install`
3. Run `npm run build` on the front-end directory

### Running the back-end server
1. `cd ..` and `cd ./backend` (Move out of the front-end directory and go into the backend directory)
2. Run `npm install`
3. Run `npm start` or `npm run start` and the server should run, listen to port 8000 and socket listens to port 8080, and the front-end is served by the back-end

### Running the app as host
1. Open `localhost:8000` on a browser with no cookies (either a Guest session or Incognito mode or equivalent)
2. Login to Spotify
3. Host is whoever runs the app / site session first
4. To invite guests into the room, click on the `invite` button at the top right of the page and it will give you an alert box showing the link 

### Running the app as guests
1. Open `localhost:8000` on a second browser window or different browser
- For instance, if the host uses a Guest window on Edge, the second user will need to run it on a different browser such as Chrome or Firefox or he/she will need to run it on Edge inPrivate/Incognito mode and not on any Guest window on Edge
2. Login to Spotify

### Some Important Notes
- We sync the songs at the start of the next song, so when the host changes songs, everyone starts the next song
- Wake up your device and do a play and pause shortly before logging in since Spotify needs to detect your device as active
- If your Spotify app doesn't play the song (especially the phone app), try restarting the Spotify app one or two times because Spotify might not detect this device as active
