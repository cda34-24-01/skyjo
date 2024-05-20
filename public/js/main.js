const main = document.getElementById("mainContainer");

function CreatPlayerContainer(number) {
    const columns = document.createElement("div");
    columns.className = "columns is-flex is-justify-content-space-evenly mb-0";
    const column = document.createElement("div");
    column.className = "column has-background-success";
    const card = document.createElement("div");
    card.className = "card is-align-content-center";

    function generatColumn(number) {
        for (let index = 0; index < number; index++) {
            columns.innerHTML += column.outerHTML;
        }
    }
    function generateCard(number) {
        for (let index = 0; index < number; index++) {
            column.innerHTML += card.outerHTML;
        }
    }
    generateCard(number);
    generatColumn(number);

    main.appendChild(columns);
}

CreatPlayerContainer(3);
CreatPlayerContainer(3);
CreatPlayerContainer(3);
CreatPlayerContainer(3);
