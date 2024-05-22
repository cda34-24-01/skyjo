const main = document.getElementById("mainContainer");

const randomNumber = [];

function generateArray() {
    for (let i = 0; i < 10; i++) {
        randomNumber.push(1); // +1 (10 fois)
        randomNumber.push(2); // +2 (10 fois)
        randomNumber.push(3); // +3 (10 fois)
        randomNumber.push(4); // +4 (10 fois)
        randomNumber.push(5); // +5 (10 fois)
        randomNumber.push(6); // +6 (10 fois)
        randomNumber.push(7); // +7 (10 fois)
        randomNumber.push(8); // +8 (10 fois)
        randomNumber.push(9); // +9 (10 fois)
        randomNumber.push(10); // +10 (10 fois)
        randomNumber.push(11); // +11 (10 fois)
        randomNumber.push(12); // +12 (10 fois)
    }

    for (let i = 0; i < 10; i++) {
        randomNumber.push(-1); // -1 (10 fois)
    }

    for (let i = 0; i < 15; i++) {
        randomNumber.push(0); // 0 (15 fois)
    }

    for (let i = 0; i < 5; i++) {
        randomNumber.push(-2); // -2 (5 fois)
    }
}
generateArray();

console.log(randomNumber);

let deletedArray = [];

Array.prototype.random = function () {
    let currentNumber = this[Math.floor(Math.random() * this.length)];
    return currentNumber;
};
let columns = 4;
let rows = 3;

function createPlayerContainer() {
    const playerContainer = document.createElement("div"); // creation du contenair du joueur  , doit avoir un id qui doit étre genere automatiquement eb websocket
    playerContainer.classList.add(
        "columns",
        "is-flex",
        "is-justify-content-space-evenly",
        "mb-0"
    );

    // Creation des column
    for (let i = 0; i < rows; i++) {
        const column = document.createElement("div");
        column.classList.add("column", "has-background-success");

        // Create columns within each row
        for (let j = 0; j < columns; j++) {
            const card = document.createElement("div");
            card.classList.add("card", "is-align-content-center");
            card.textContent = randomNumber.random(); //  attribution d'un nombre random ( a modifier en utilisant une fonction qui regroupe chaque carte)
            deletedArray += randomNumber.random();
            column.appendChild(card);
        }

        playerContainer.appendChild(column);
    }

    main.appendChild(playerContainer);
    console.log(deletedArray);
}

createPlayerContainer();
