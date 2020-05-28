const express =  require('express')
const path = require('path');
const socketio = require('socket.io');
const app = express()

let userMap = new Map();

app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../frontend/build/index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port);

console.log('App is listening on port ' + port);

io.on('connection', (socket) => {
    console.log('We have a new connection!!!');
    socket.on('joining', (userInfo) => {
        userMap.set(socket.id, {name: userInfo.name, room: userInfo.room});
        //socket.emit('message', {user: 'admin', text: `${user.name}, welcome to this chat room!`});
        socket.broadcast.to(userInfo.room).emit('serverMessage', { message: `${user.name}, has joined`});
        socket.join(userInfo.room);
    });
    socket.on('sendMessage', (message) => {
        const userInfo = userMap.get(socket.id);
        io.to(userInfo.room).emit('broadcastedMessage', {username: userInfo.name, message});
    });
    socket.on('disconnect', () => {
        const userInfo = userMap.get(socket.id);
        if(userInfo) {
            userMap.delete(socket.id);
            io.to(userInfo.room).emit('serverMessage', {message: `${user.name} has left`});
        }
    })
});