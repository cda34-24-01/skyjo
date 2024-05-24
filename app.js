const { Socket } = require('socket.io');

const express = require('express');

const app = express();
const path = require('path');
const { type } = require('os');
const { start } = require('repl');
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

io.on("connection", (socket) => {
  console.log(`[Connexion] ${socket.id} user connected`);

  socket.on("playerData", (player) => {
    console.log(`[playerData] ${player.username} joined the game`);
    console.log(`[playerData] Info Player : ${player.roomId} - ${player.username} - ${player.host} - ${player.turn} - ${player.socketId}`)
    
    let room = null;

    if (!player.roomId) {
      room = createRoom(player);
      console.log(
        `[create room] - Room created: ${room.id} - ${player.username}`
      );
    } else {
      room = rooms.find((room) => room.id === player.roomId);

      if (room === undefined) {
        return;
      }

      room.players.push(player);
      console.log(`[join room] - Room joined: ${room.id} - ${player.username}`);
    }

    socket.join(room.id);

    io.to(socket.id).emit("join room", room.id);

    if (room.players.length === 2) {
      io.to(room.id).emit("start game", room.players);
    }
  });

  socket.on("get rooms", () => {
    io.to(socket.id).emit("list rooms", rooms);
  });

  socket.on('play', (player) => {
    io.to(player.roomId).emit('play', player);
  });

  socket.on("disconnect", () => {
    console.log(`[Disconnect] ${socket.id} user disconnected`);
    let room = null;

    rooms.forEach((r) => {
      r.players.forEach((p) => {
        if (p.socketId === socket.id && p.host) {
          room = r;
          rooms = rooms.filter((r) => r !== room);
        }
      });
    });
  });
 
});


function createRoom(player) {
  const room = { id: roomId(), players: [] };

  player.roomId = room.id;
  room.players.push(player);
  rooms.push(room);
  return room;
}

function roomId() {
    return Math.random().toString(36).substr(2, 9);
}