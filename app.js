const { Socket } = require('socket.io');

const express = require('express');

const app = express();
const path = require('path');
const { type } = require('os');
const http = require('http').createServer(app);
const port = 8080;

/** 
 * @type { Socket }
*/

const io = require('socket.io')(http);

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/base.html'));
});

app.get('/games/skyjo', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/games/skyjo.html'));
});

http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let rooms = [];

io.on('connection', (socket) => {
    console.log(`[Connexion] ${socket.id} user connected`);

    socket.on('playerData', (player) => {
        console.log(`[playerData] ${player.username} joined the game`);
        let room = null;

        if (!player.roomId) {
            room = createRoom(player);  
            console.log(`[create room ] - Room created: ${room.id} - ${player.username}`);
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    }
    );
});

function createRoom(player) {
    const room = {id: roomId, players: [] };
    
    player.roomId = room.id;
    room.players.push(player);
    rooms.push(room);

    return room;
}

function roomId() {
    return Math.random().toString(36).substr(2, 9);
}