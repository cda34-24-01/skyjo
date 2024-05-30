const player = {
  chooseCard: 0,
  color: "",
  deck: [],
  host: false,
  imageElement: null,
  imagePick: {
    image: "",
    value: 0,
  },
  lastRound: false,
  playedCell: "",
  pick: null,
  roomId: null,
  score: 0,
  socketId: "",
  turn: true,
  username: "",
  win: false,
};

let defausseInit = {
  init: 0,
  currentValue: 0,
};

/*   const cards = Array.from({ length: 12 }, () => ({
    image: '/images/1.png',
    value: 1,
    number: 10,
  })); */

const cards = [
  {
    image: "/images/-2.png",
    value: -2,
    number: 5,
  },
  {
    image: "/images/-1.png",
    value: -1,
    number: 10,
  },
  {
    image: "/images/0.png",
    value: 0,
    number: 15,
  },
  {
    image: "/images/1.png",
    value: 1,
    number: 10,
  },
  {
    image: "/images/2.png",
    value: 2,
    number: 10,
  },
  {
    image: "/images/3.png",
    value: 3,
    number: 10,
  },
  {
    image: "/images/4.png",
    value: 4,
    number: 10,
  },
  {
    image: "/images/5.png",
    value: 5,
    number: 10,
  },
  {
    image: "/images/6.png",
    value: 6,
    number: 10,
  },
  {
    image: "/images/7.png",
    value: 7,
    number: 10,
  },
  {
    image: "/images/8.png",
    value: 8,
    number: 10,
  },
  {
    image: "/images/9.png",
    value: 9,
    number: 10,
  },
  {
    image: "/images/10.png",
    value: 10,
    number: 10,
  },
  {
    image: "/images/11.png",
    value: 11,
    number: 10,
  },
  {
    image: "/images/12.png",
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
const linkToShare = document.getElementById("link-to-share");

const pioche = document.getElementById("pioche");
const defausse = document.getElementById("defausse");

let enemyUsername = "";

socket.emit("get rooms");
socket.on("list rooms", (rooms) => {
  let html = "";

  if (rooms.length > 0) {
    rooms.forEach((room) => {
      if (room.players.length !== 2) {
        html += `<form method="POST" id="form2" onsubmit="event.preventDefault();playerData('${room.id}');">
            <li class="list-group-item d-flex justify-content-between bg-dark mb-3 rounded">
            <div class="d-flex">
                <p class="p-0 m-0 flex-grow-1 fw-bold text-white">Salon de ${room.players[0].username} - ${room.id}</p>
                <p class="p-0 m-0 ms-5 flex-grow-1 fw-bold text-white">${room.players.length}/8</p>
                </div>
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
  player.color = getRandomColor(roomId);
  player.deck = initPlayerDeck(roomId);
  player.host = true;
  player.roomId = roomId;
  player.socketId = socket.id;
  player.turn = roomId === null ?? true;
  player.username = usernameInput.value;

  userCard.hidden = true;
  waitingArea.classList.remove("d-none");
  roomsCard.classList.add("d-none");

  socket.emit("playerData", player);
}

/* function initDefausse(roomId) {
  const defausse = document.getElementById("defausse");
  const card = getRandomCard(roomId);
  defausse.src = card.image;
}
 */
let followMouse = false;
let imgToFollow;
let imgToFollowInfo;

document.addEventListener("mousemove", function (e) {
  if (followMouse && imgToFollow) {
    const imgWidth = imgToFollow.offsetWidth;
    const imgHeight = imgToFollow.offsetHeight;
    imgToFollow.style.left = e.pageX - imgWidth / 2 + "px";
    imgToFollow.style.top = e.pageY - imgHeight / 2 + "px";

    //QUAND ON REMPLACE LA CARTE IL FAUT DECOMPTER LE SCORE PUIS RECOMPTER LE NOUVEAU SCORE
  }
});

document.addEventListener("click", function (e) {
  const cell = e.target.closest(".cell img"); // Or any other selector.
  const pioche = e.target.closest("#pioche"); // Or any other selector.
  const defausse = e.target.closest("#defausse"); // Or any other selector.

  if (pioche) {
    if (player.pick != null || player.chooseCard < 2) {
      return;
    }
    if (player.turn) {
      imgToFollow = document.createElement("img");
      imgToFollowInfo = getRandomCard(player.roomId);
      imgToFollow.src = imgToFollowInfo.image;
      imgToFollow.style.position = "absolute";
      imgToFollow.classList.add("player-card", "rounded", "pointer");
      document.body.appendChild(imgToFollow);

      player.imagePick.image = imgToFollowInfo.image;
      player.imagePick.value = imgToFollowInfo.value;
      player.pick = "pioche";
      followMouse = true;
    }
    return;
  }

  if (defausse) {
    if (player.chooseCard < 2) {
      return;
    }
    if (player.pick != null && player.pick != "pioche") {
      return;
    }
    if (player.turn) {
      if (player.pick == "pioche") {
        console.log("pioche et defausse");
        defausse.src = imgToFollowInfo.image;
        imgToFollow.remove();
      } else {
        console.log("defausse");
        imgToFollow = document.createElement("img");
        imgToFollowInfo = { image: defausse.src, value: defausse.value };
        imgToFollow.src = defausse.src;
        imgToFollow.style.position = "absolute";
        imgToFollow.classList.add("player-card", "rounded", "pointer");
        document.body.appendChild(imgToFollow);
        followMouse = true;
        /* defausse.src = imgToFollowInfo.image; */
      }
      player.pick = "defausse";
    }
    return;
  }

  if (cell) {
    if (player.pick == null && player.chooseCard >= 2) {
      return;
    }
    const playedCell = cell.getAttribute("id");
    const playedCellName = cell.getAttribute("data-username");

    player.chooseCard++;
    if (player.chooseCard < 2) {
      if (cell.getAttribute("src") === "/images/verso.png") {
        player.turn = true;
        player.playedCell = playedCell;
        returnCard(cell, player);
        socket.emit("choose", player);
      }
      return;
    }

    if (playedCellName !== player.username) {
      return;
    }

    if (
      (cell.getAttribute("src") === "/images/verso.png" && player.turn) ||
      (player.pick == "defausse" && player.turn) ||
      (player.pick == "pioche" && player.turn)
    ) {
      player.playedCell = playedCell;
      if (player.pick != null) {
        /* defausse.src = imgToFollowInfo.image; */
        imgToFollow.remove();
        player.imageElement = cell;
        replaceCard(cell, player);
        followMouse = false;
        /* returnCard(cell, player); */
      } else {
        //Syncronisation des cartes
        returnCard(cell, player);
      }

      /* player.win = calculateWin(playedCell); */

      //Ajoute le filtre gris sur les cartes qui ont le même numéro dans la colonne
      addFilterGray(cell, player.username);

      // Vérifie si la partie est terminée
      if (checkEndGame(player)) {
        player.lastRound = true;
        /* SetTurnMessage('alert-info', 'alert-warning', "La partie est terminée !");
          return; */
      }

      player.turn = false;
      player.pick = null;

      console.log(player.score);

      socket.emit("play", player);
    }
  }
});

function extraireNumeroImage(srcImage) {
  const regex = /\/images\/(\d+)\.png/; // Expression régulière pour extraire le chiffre
  const resultat = srcImage.match(regex);

  if (resultat) {
    return resultat[1]; // Le numéro est capturé dans le premier groupe de capture
  } else {
    return null; // L'URL ne correspond pas au format attendu
  }
}

socket.on("join room", (roomId) => {
  player.roomId = roomId;
  linkToShare.innerHTML = `<a href="${window.location.href}?${player.roomId}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
});

socket.on("start game", (players) => {
  startGame(players);
});

socket.on("choose", (enemyPlayer) => {
  if (player.username === enemyPlayer.username) {
    return;
  } else {
    let playedCellId = enemyPlayer.playedCell;
    let enemyUsername = enemyPlayer.username;
    let imageElement = document.getElementById(`${playedCellId}`);

    if (imageElement) {
      returnCard(imageElement, enemyPlayer);
    }

    if (player.chooseCard < 2 || enemyPlayer.chooseCard < 2) {
      SetTurnMessage(
        "alert-info",
        "alert-success",
        "Veuillez-choisir 2 cartes, puis patientez..."
      );
    } else {
      if (player.host && player.turn) {
        //if (player.score > enemyPlayer.score) {
        SetTurnMessage("alert-info", "alert-success", "C'est à vous de jouer");
      } else {
        SetTurnMessage(
          "alert-success",
          "alert-info",
          `C'est à ${enemyUsername} de jouer`
        );
      }
    }
  }
});

function returnCard(cell, player) {
  const cellId = cell.getAttribute("id");
  const columns = ["Column1", "Column2", "Column3", "Column4"];
  const rows = ["Cell1", "Cell2", "Cell3"];
  const deckIndices = [
    [0, 1, 2, 3], // Indices for Cell1 in each column
    [4, 5, 6, 7], // Indices for Cell2 in each column
    [8, 9, 10, 11], // Indices for Cell3 in each column
  ];

  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (
        cellId === `${rows[rowIndex]},${columns[colIndex]},${player.username}`
      ) {
        const deckIndex = deckIndices[rowIndex][colIndex];
        cell.src = player.deck[deckIndex].image;
        player.score += player.deck[deckIndex].value;
        return;
      }
    }
  }
}

function getSrcImageBeforeReplace(cell, player) {
  const cellId = cell.getAttribute("id");
  const columns = ["Column1", "Column2", "Column3", "Column4"];
  const rows = ["Cell1", "Cell2", "Cell3"];
  const deckIndices = [
    [0, 1, 2, 3], // Indices for Cell1 in each column
    [4, 5, 6, 7], // Indices for Cell2 in each column
    [8, 9, 10, 11], // Indices for Cell3 in each column
  ];

  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (
        cellId === `${rows[rowIndex]},${columns[colIndex]},${player.username}`
      ) {
        const deckIndex = deckIndices[rowIndex][colIndex];
        return player.deck[deckIndex].image;
      }
    }
  }
}

function replaceCard(cell, player) {
  let cellId;

  if (cell && cell instanceof HTMLElement) {
    cellId = cell.getAttribute("id");
    if (!cellId) {
      cell = document.getElementById(`${player.playedCell}`);
    }
  } else {
    cellId = player.playedCell;
    cell = document.getElementById(`${cellId}`);
  }

  defausse.src = getSrcImageBeforeReplace(cell, player);

  const columns = ["Column1", "Column2", "Column3", "Column4"];
  const rows = ["Cell1", "Cell2", "Cell3"];

  for (let column of columns) {
    for (let row of rows) {
      if (cellId === `${row},${column},${player.username}`) {
        cell.src = player.imagePick.image;
        player.score += player.imagePick.value;
        return;
      }
    }
  }
  imgToFollowInfo = null;
}

socket.on("play", (enemyPlayer) => {
  if (enemyPlayer.socketId !== player.socketId && !enemyPlayer.turn) {
    let playedCellId = enemyPlayer.playedCell;
    let enemyUsername = enemyPlayer.username;
    let imageElement = document.getElementById(`${playedCellId}`);

    if (enemyPlayer.imageElement != null) {
      replaceCard(enemyPlayer.imageElement, enemyPlayer);
    } else {
      if (imageElement) {
        //Syncronisation des cartes
        returnCard(imageElement, enemyPlayer);
      }
    }

    //Ajoute le filtre gris sur les cartes qui ont le même numéro dans la colonne
    addFilterGray(imageElement, enemyUsername);

    if (enemyPlayer.win) {
      SetTurnMessage(
        "alert-info",
        "alert-danger",
        `C'est perdu ! ${enemyPlayer.username} a gagné !`
      );
      calculateWin(enemyPlayer.playedCell, "O");
      //showRestartArea();
      return;
    }

    if (calculateEquality()) {
      SetTurnMessage("alert-info", "alert-warning", "C'est une egalité !");
      return;
    }

    if (enemyPlayer.lastRound == true) {
      SetTurnMessage(
        "alert-info",
        "alert-warning",
        "C'est à vous, DERNIER TOUR !"
      );
    } else {
      SetTurnMessage(
        "alert-info",
        "alert-success",
        "C'est à ton tour de jouer !"
      );
    }
    player.turn = true;
  } else {
    if (player.win) {
      $("#turn-message")
        .addClass("alert-success")
        .html("Félicitations, tu as gagné la partie !");
      //showRestartArea();
      return;
    }

    if (calculateEquality()) {
      SetTurnMessage("alert-info", "alert-warning", "C'est une egalité !");
      //showRestartArea();
      return;
    }

    SetTurnMessage(
      "alert-success",
      "alert-info",
      `C'est au tour de ${enemyUsername} de jouer`
    );
    player.turn = false;
  }
});

function addFilterGray(image, playername) {
  if (image.src != "/images/verso.png") {
    const numero = extraireNumeroImage(image.getAttribute("src"));
    let column = image.getAttribute("id").split(",")[1];
    if (numero != null) {
      //Cherche dans toute la colonne si le numéro est présent dans les 3 cellules
      let number = 0;
      let totalScoreColumn = 0;
      const column = image.getAttribute("id").split(",")[1];

      for (let i = 1; i <= 3; i++) {
        const cellId = `Cell${i},${column},${playername}`;
        const cellElement = document.getElementById(cellId);
        const cellImage = cellElement.getAttribute("src");
        const cellNumber = extraireNumeroImage(cellImage);

        if (cellNumber === numero) {
          number++;
          totalScoreColumn += parseInt(cellNumber);
        }
      }

      if (number === 3) {
        let cell1 = document.getElementById(`Cell1,${column},${playername}`);
        let cell2 = document.getElementById(`Cell2,${column},${playername}`);
        let cell3 = document.getElementById(`Cell3,${column},${playername}`);

        cell1.classList.add("filter-grayscale");
        cell2.classList.add("filter-grayscale");
        cell3.classList.add("filter-grayscale");
        player.score -= totalScoreColumn;
      }
    }
  }
}

function startGame(players) {
  restartArea.classList.add("d-none");
  waitingArea.classList.add("d-none");
  gameCard.classList.remove("d-none");
  turnMsg.classList.remove("d-none");

  const enemyPlayer = players.find((p) => p.socketId !== player.socketId);
  enemyUsername = enemyPlayer.username;

  initDefausseCard(enemyPlayer.roomId);

  SetTurnMessage(
    "alert-info",
    "alert-success",
    "Veuillez-choisir 2 cartes, puis patientez..."
  );

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
      playerCell.innerHTML =
        '<img src="/images/verso.png" alt="Verso" class="rounded player-card" id="' +
        `Cell${rowIndex + 1},Column${columnIndex + 1},${player.username}` +
        '" data-username="' +
        player.username +
        '">';

      playerRow.appendChild(playerCell);
      count++;
    }

    playerTableBody.appendChild(playerRow);
  }

  // Add player information to the table header (if desired)
  let containerPlayerCards = document.querySelector(".container-players-cards");
  let divPlayerCard = document.createElement("div");
  divPlayerCard.classList.add("player-cards", "rounded");
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

function calculateWin(player) {}

function checkEndGame(thisPlayer) {
  let countEndGame = 0;
  countEndGame = 0;
  const cells = document.querySelectorAll(".cell img");

  cells.forEach((cell) => {
    if (
      cell.getAttribute("src") !== "/images/verso.png" &&
      cell.getAttribute("id").split(",")[2] === thisPlayer.username
    ) {
      countEndGame++;
    }
  });
  console.log("Compeur fin de partie : " + countEndGame);
  if (countEndGame == 12) {
    return true;
  } else {
    return false;
  }
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
  return "grey";
  const colors = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "teal",
    "yellow",
    "pink",
  ];

  let tmp_colors = [...colors];

  if (!trashColor[roomId]) {
    trashColor[roomId] = []; // Create a new sub-array if it doesn't exist
  }
  let colorPlayer = colors[Math.floor(Math.random() * colors.length)];
  trashColor[roomId].push(colorPlayer);
  trashColor[roomId].forEach((color) => {
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
  tmpCards = tmpCards.filter((card) => card !== cardPlayer); // Filtrer le tableau tmp_cards

  return cardPlayer;
}

// Fonction pour obtenir une carte aléatoire
function initDefausseCard(roomId) {
  if (defausseInit.init == 0) {
    defausseInit.init = 1;
    // Copier les cartes dans un tableau temporaire
    let tmpCard = getRandomCard(roomId);
    console.log(tmpCard);
    defausse.src = tmpCard.image;
    socket.emit("updateDefausse", tmpCard);
  }
}

socket.on("updateDefausse", (card) => {
  console.log("Dans la défausse");
  defausseInit.init = 1;
  defausse.src = card.image;
});
