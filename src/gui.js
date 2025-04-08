import { SIZE } from "./gameboard.js";

// TODO(miha): This will be moved to the game factory! also remove from gameboard.js
const _defaultGameboardRules = {
    numberOfShipsAtStart: 5,
    // NOTE(miha): key: ship length, value: occurences of such ship at the start
    shipToCountMap: {
        2: 1,
        3: 2,
        4: 1,
        5: 1,
    },
};

const GUI = (game) => {
    const main = document.querySelector("main");

    const drawShips = () => {
        const div = document.querySelector(".ships");

        for (const [k, v] of Object.entries(_defaultGameboardRules.shipToCountMap)) {
            const shipLength = k;
            for (let i = 0; i < v; i++) {
                const ship = document.createElement("div");
                ship.classList.add("ship");
                ship.classList.add("always-border");
                for (let j = 0; j < shipLength; j++) {
                    const cell = document.createElement("div");
                    cell.classList.add("cell");
                    ship.appendChild(cell);
                }

                ship.addEventListener("click", (e) => {
                    if (!e.target.parentNode.classList.contains("ships"))
                        e.target.parentNode.classList.toggle("ship-border");
                });

                div.appendChild(ship);
            }
        }
    };

    const drawGameboard = () => {
        const div = document.querySelector(".gameboard");

        for (let r = 0; r < SIZE; r++) {
            const row = document.createElement("div");
            for (let c = 0; c < SIZE; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                row.appendChild(cell);
            }
            div.appendChild(row);
        }
    };

    const drawGuesses = () => {
        const div = document.querySelector(".guesses");

        for (let r = 0; r < SIZE; r++) {
            const row = document.createElement("div");
            for (let c = 0; c < SIZE; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                row.appendChild(cell);
            }
            div.appendChild(row);
        }
    };

    return { drawShips, drawGameboard, drawGuesses };

};

export { GUI };
