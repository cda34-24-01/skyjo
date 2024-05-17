
const player = {
    host: false,
    playedCell: "",
    roomId: null,
    username: "",
    socketId: "",
    symbol: "X",
    turn: false,
    win: false
};

const socket = io();

const usernameInput = document.getElementById('username');

$("#form").on('submit', function(e) {
    e.preventDefault();
    player.username = usernameInput.value;
    console.log(player);
    /* socket.emit('playerData', player); */
});