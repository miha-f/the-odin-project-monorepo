import { SIZE } from "./gameboard.js";
import { State } from "./state.js";

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


    let state = State();

    const drawShips = () => {
        const div = document.querySelector(".ships");
        let shipCount = 0;

        const rotateButton = document.querySelector("button");
        rotateButton.addEventListener("click", () => {
            state.shipSelector.rotate = !state.shipSelector.rotate;
        });

        for (const [k, v] of Object.entries(_defaultGameboardRules.shipToCountMap)) {
            const shipLength = k;
            for (let i = 0; i < v; i++) {
                const ship = document.createElement("div");
                ship.classList.add("ship");
                ship.classList.add("always-border");
                ship.setAttribute("data-id", `ship-${shipCount}`);
                for (let j = 0; j < shipLength; j++) {
                    const cell = document.createElement("div");
                    cell.classList.add("cell");
                    ship.appendChild(cell);
                }

                ship.addEventListener("click", (e) => {
                    if (e.target.parentNode.classList.contains("ships"))
                        return;

                    const ships = document.querySelectorAll(".ship");
                    ships.forEach((ship) => {
                        ship.classList.remove("ship-border");
                    });

                    state.shipSelector.length = e.target.parentNode.querySelectorAll(".cell").length;

                    state.shipSelector.id = e.target.parentNode.getAttribute("data-id");
                    e.target.parentNode.classList.toggle("ship-border");
                });

                shipCount++;
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

                cell.setAttribute("data-id", `cell-${r * SIZE + c}`);

                cell.addEventListener("mouseenter", (e) => {
                    const id = e.target.getAttribute("data-id");
                    if (state.shipSelector.id) {
                        const cells = div.querySelectorAll(".cell");
                        cells.forEach((cell) => {
                            cell.classList.remove("hover");
                        });

                        state.shipSelector.cells = [];

                        // NOTE(miha): HORIZONTAL direction
                        if (!state.shipSelector.rotate) {
                            for (let i = 0; i < state.shipSelector.length; i++) {
                                const newId = Number(id.split("-")[1]) + (i * SIZE);
                                if (newId < 100) {
                                    const cell = div.querySelector(`[data-id="cell-${newId}"]`);
                                    cell.classList.add("hover");
                                    state.shipSelector.cells.push(cell);
                                }
                            }
                        } else {
                            for (let i = 0; i < state.shipSelector.length; i++) {
                                const oldId = Number(id.split("-")[1]);
                                const newId = oldId + i;
                                // NOTE(miha): Make sure that oldId (cursor loc) and newId are on the same column.
                                if (newId < 100 && Math.floor(oldId / 10) === Math.floor(newId / 10)) {
                                    const cell = div.querySelector(`[data-id="cell-${newId}"]`);
                                    cell.classList.add("hover");
                                    state.shipSelector.cells.push(cell);
                                }
                            }
                        }


                    }
                });

                cell.addEventListener("click", (e) => {
                    if (!state.shipSelector.id)
                        return;

                    state.shipSelector.cells.forEach((cell) => {
                        cell.classList.add("placed");
                    });

                    const ship = document.querySelector(`[data-id="${state.shipSelector.id}"]`);
                    ship.remove();

                    state.shipSelector = {
                        id: "",
                        rotate: false,
                        length: -1,
                        cells: [],
                    };


                });
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
