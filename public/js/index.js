
const player = {
  host: false,
  playedCell: "",
  roomId: null,
  username: "",
  socketId: "",
  color: "",
  deck: [],
  turn: false,
  win: false,
};

const cards = [
  {
    image: '/images/-2.png',
    value: -2,
    number: 5,
  },
  {
    image: '/images/-1.png',
    value: -1,
    number: 10,
  },
  {
    image: '/images/0.png',
    value: 0,
    number: 15,
  },
  {
    image: '/images/1.png',
    value: 1,
    number: 10,
  },
  {
    image: '/images/2.png',
    value: 2,
    number: 10,
  },
  {
    image: '/images/3.png',
    value: 3,
    number: 10,
  },
  {
    image: '/images/4.png',
    value: 4,
    number: 10,
  },
  {
    image: '/images/5.png',
    value: 5,
    number: 10,
  },
  {
    image: '/images/6.png',
    value: 6,
    number: 10,
  },
  {
    image: '/images/7.png',
    value: 7,
    number: 10,
  },
  {
    image: '/images/8.png',
    value: 8,
    number: 10,
  },
  {
    image: '/images/9.png',
    value: 9,
    number: 10,
  },
  {
    image: '/images/10.png',
    value: 10,
    number: 10,
  },
  {
    image: '/images/11.png',
    value: 11,
    number: 10,
  },
  {
    image: '/images/12.png',
    value: 12,
    number: 10,
  },
];

const socket = io();

const usernameInput = document.getElementById("username");

const gameCard = document.getElementById("game-card");
const userCard = document.getElementById("user-card");

const restartArea = document.getElementById("restart-area");
const waitingArea = document.getElementById("waiting-area");

const roomsCard = document.getElementById("rooms-card");
const roomsList = document.getElementById("rooms-list");

const turnMsg = document.getElementById("turn-message");

let ennemyUsername = "";

socket.emit("get rooms");
socket.on("list rooms", (rooms) => {
  let html = "";

  if (rooms.length > 0) {
    rooms.forEach((room) => {
      if (room.players.length !== 2) {
        html += `<form method="POST" id="form2" onsubmit="event.preventDefault();playerData('${room.id}');">
            <li class="list-group-item d-flex justify-content-between">
                <p class="p-0 m-0 flex-grow-1 fw-bold">Salon de ${room.players[0].username} - ${room.id}</p>
                <button class="btn btn-sm btn-success join-room" type="submit" data-room="${room.id}">Rejoindre</button>
            </li>
            </form>`;
      }

    });
  }

  if (html !== "") {
    roomsCard.classList.remove("d-none");
    roomsList.innerHTML = html;

    for (const element of document.getElementsByClassName("join-room")) {
      element.addEventListener("click", joinRoom, false);
    }
  }
});

function playerData(roomId = null) {
  player.username = usernameInput.value;
  player.roomId = roomId;
  player.host = true;
  player.turn = roomId === null ?? true;
  player.socketId = socket.id;
  player.deck = initPlayerDeck(roomId);
  player.color = getRandomColor(roomId);

  userCard.hidden = true;
  waitingArea.classList.remove("d-none");
  roomsCard.classList.add("d-none");

  socket.emit("playerData", player);
}


document.addEventListener("click", function (e) {
  const cell = e.target.closest(".cell"); // Or any other selector.
  console.log(player.turn);
    const playedCell = cell.getAttribute("id");
    console.log(playedCell);
    if (cell.innerText === "" && player.turn) {
      player.playedCell = playedCell;
      cell.style.display = "none"; 
      /* player.win = calculateWin(playedCell); */
      player.turn = false;

      socket.emit("play", player);
    }
});


/* $(document).ready(function () {
  $(".cell").on("click", function (e) {
    console.log(player.turn);
    const playedCell = this.getAttribute("id");
    console.log(playedCell);
    if (this.innerText === "" && player.turn) {
      player.playedCell = playedCell;
      this.innerText = "test";
      player.win = calculateWin(playedCell);
      player.turn = false;

      socket.emit("play", player);
    }
  });
}); */

socket.on("start game", (players) => {
  startGame(players);
});

socket.on("play", (ennemyPlayer) => {
  if (ennemyPlayer.socketId !== player.socketId && !ennemyPlayer.turn) {
    const playedCell = document.getElementById(ennemyPlayer.playedCell);
    playedCell.classList.add("text-danger");
    playedCell.innerHtml = "O";
    if (ennemyPlayer.win) {
      updateTurnMessage(
        "alert-info",
        "alert-danger",
        `Vous avez perdu ! <b>${ennemyPlayer.username}</b> a gagné !`
      );
      return;
    }
    if (calculateEquality()) {
      updateTurnMessage("alert-info", "alert-warning", "Egalité !");
      return;
    }

    updateTurnMessage("alert-danger", "alert-success", "C'est à vous de jouer");
    player.turn = true;
  } else {
    if (player.win) {
      $("#turn-message").addClass("alert-success").html = "Vous avez gagné !";
      return;
    }

    if (calculateEquality()) {
      updateTurnMessage("alert-info", "alert-warning", "Egalité !");
      return;
    }

    updateTurnMessage("alert-success", "alert-info", `C'est à ${ennemyUsername} de jouer`);
    player.turn = false;
  }
});

function startGame(players) {
  console.log(players);
  restartArea.classList.add("d-none");
  waitingArea.classList.add("d-none");
  gameCard.classList.remove("d-none");
  turnMsg.classList.remove("d-none");

  const ennemyPlayer = players.find((p) => p.socketId !== player.socketId);
  ennemyUsername = ennemyPlayer.username;

  if (player.host && player.turn) {
    SetTurnMessage("alert-info", "alert-success", "C'est à vous de jouer");
  } else {
    SetTurnMessage(
      "alert-success",
      "alert-info",
      `C'est à ${ennemyUsername} de jouer`
    );
  }


  players.forEach((p) => {
    createPlayerTable(p);
  });
}


function createPlayerTable(player) {
  // Create the table elements
  let playerTable = document.createElement("table");
  let playerTableBody = document.createElement("tbody");
  let count = 0;

  // Create and append table rows
  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    let playerRow = document.createElement("tr");

    // Create and append table cells for each row
    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      let playerCell = document.createElement("td");
      playerCell.classList.add("cell");
      playerCell.innerHTML = `<img src="${player.deck[count].image}" alt="${player.deck[count].value}" data-value="${player.deck[count].value}">`;
      playerCell.setAttribute("id", `Cell ${rowIndex + 1}, Column ${columnIndex + 1}`);

      playerRow.appendChild(playerCell);
      count++;
    }

    playerTableBody.appendChild(playerRow);
  }

  // Add player information to the table header (if desired)
  let containerPlayerCards = document.querySelector(".container-players-cards");
  let divPlayerCard = document.createElement("div");
  divPlayerCard.classList.add("player-card");
  let playerTableHeader = document.createElement("thead");
  let playerTableHeaderRow = document.createElement("tr");
  let playerTableHeaderCell = document.createElement("th");
  playerTableHeaderCell.colSpan = 4; // Span the header cell across all 4 columns
  playerTableHeaderCell.textContent = player.username; // Replace with your player data
  divPlayerCard.style.backgroundColor = player.color;
  playerTableHeaderRow.appendChild(playerTableHeaderCell);
  playerTableHeader.appendChild(playerTableHeaderRow);

  // Style the table as needed (optional)
  playerTable.style.border = "1px solid black";
  playerTable.style.width = "100%";

  // Combine header and body and append to the container
  playerTable.appendChild(playerTableHeader);
  playerTable.appendChild(playerTableBody);
  divPlayerCard.appendChild(playerTable);
  containerPlayerCards.appendChild(divPlayerCard);
}

function SetTurnMessage(classToRemove, classToAdd, html) {
  turnMsg.classList.remove(classToRemove);
  turnMsg.classList.add(classToAdd);
  turnMsg.innerText = html;
}

function calculateEquality() {
  let equality = true;
  const cells = document.getElementsByClassName("cell");

  for (const cell of cells) {
    if (cell.textContent === "") {
      equality = false;
    }
  }
  return equality;
}

const joinRoom = function () {
  if (usernameInput.value !== "") {
    player.username = usernameInput.value;
    player.socketId = socket.id;
    player.roomId = this.dataset.room;
    player.color = getRandomColor(this.dataset.room);
    player.deck = initPlayerDeck(this.dataset.room);

    socket.emit("playerData", player);
    userCard.hidden = true;
    waitingArea.classList.remove("d-none");
    roomsCard.classList.add("d-none");
  }
};

let trashColor = []; // Initialize as an empty array 
function getRandomColor(roomId) {
  const colors = ["red", "green", "blue", "orange", "purple", "teal", "yellow", "pink"];

  let tmp_colors = [...colors];

  if (!trashColor[roomId]) {
    trashColor[roomId] = []; // Create a new sub-array if it doesn't exist 
  }
  let colorPlayer = colors[Math.floor(Math.random() * colors.length)];
  trashColor[roomId].push(colorPlayer);
  trashColor[roomId].forEach(color => {
    if (tmp_colors.includes(color)) {
      const index = tmp_colors.indexOf(color);
      tmp_colors.splice(index, 1);
    }
  });

  //console.log(colors); // Affichage du tableau des couleurs après suppression 
  //console.log(trashColor); // Affichage du tableau 'trash' 
  //console.log(tmp_colors); // Affichage du tableau 'trash'

  return colorPlayer;

}

function initPlayerDeck(roomId) {
  let playerDeck = [];
  for (let i = 0; i < 12; i++) {
    playerDeck.push(getRandomCard(roomId));
  }
  return playerDeck;
}

let trashCards = []; // Initialize as an empty array
let roomCards = {}; // Objet pour stocker les cartes par salle
function getRandomCard(roomId) {
  roomCards[roomId] = [...cards]; // Copier les cartes dans le tableau de la salle


  let tmpCards = [...roomCards[roomId]]; // Créer une copie du tableau des cartes de la salle

  if (!trashCards[roomId]) {
    trashCards[roomId] = []; // Initialiser le tableau 'trash' si nécessaire
  }

  let cardPlayer;
  do {
    cardPlayer = tmpCards[Math.floor(Math.random() * tmpCards.length)];
  } while (cardPlayer.number === 0); // Recommencer si 'number' est 0

  trashCards[roomId].push(cardPlayer); // Ajouter la carte sélectionnée au tableau 'trash'
  cardPlayer.number--; // Décrémenter le 'number' de la carte sélectionnée
  tmpCards = tmpCards.filter(card => card !== cardPlayer); // Filtrer le tableau tmp_cards

  return cardPlayer;
}


