import { SIZE, HORIZONTAL, VERTICAL, GRID_SHIP } from "./gameboard.js";
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

    const createShipDiv = (id, length) => {
        const ship = document.createElement("div");
        ship.classList.add("ship");
        ship.classList.add("always-border");
        ship.setAttribute("data-id", `ship-${id}`);
        ship.setAttribute("data-length", `ship-${length}`);
        for (let j = 0; j < length; j++) {
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

        return ship;
    };

    const drawShips = () => {
        const div = document.querySelector(".ships");

        const rotateButton = document.querySelector("button");
        rotateButton.addEventListener("click", () => {
            state.shipSelector.rotate = !state.shipSelector.rotate;
        });

        for (const [k, v] of Object.entries(_defaultGameboardRules.shipToCountMap)) {
            const shipLength = k;
            for (let i = 0; i < v; i++) {
                const ship = createShipDiv(state.shipCount, shipLength);
                state.shipCount++;
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
                    const id = e.target.getAttribute("data-id").split("-")[1];
                    const column = Math.floor(id / 10);
                    const row = id % 10;
                    const direction = state.shipSelector.rotate === false ? HORIZONTAL : VERTICAL;

                    // NOTE(miha): If no ship is selected we are:
                    //      1. removing ship from gameboard (if clicked on ship)
                    //      2. doing nothing (if clicked on empty cell) 
                    if (!state.shipSelector.id) {
                        // NOTE(miha): Check if we are removing ship from gameboard
                        // back to ship shelf.
                        const cellType = game.getPlayer().getGameboard().getGridCell(row, column);
                        if (cellType === GRID_SHIP) {
                            const removedKeys = game.getPlayer().getGameboard().removeShip(row, column);
                            for (const key of removedKeys) {
                                const [row, column] = key.split(",").map(Number);
                                const shipCell = div.querySelector(`[data-id="cell-${column * SIZE + row}"]`);
                                shipCell.classList.remove("placed");
                                shipCell.classList.remove("hover");
                            }
                            const shipsDiv = document.querySelector(".ships");
                            const ship = createShipDiv(state.shipCount, removedKeys.length);
                            state.shipCount++;
                            shipsDiv.appendChild(ship);
                        }
                        return;
                    }

                    const err = game.addPlayerShip(state.shipSelector.length, row, column, direction);
                    if (err !== undefined) {
                        return;
                    }

                    state.shipSelector.cells.forEach((cell) => {
                        cell.classList.add("placed");
                    });

                    const ship = document.querySelector(`[data-id="${state.shipSelector.id}"]`);
                    ship.remove();

                    state.shipSelector = {
                        ...state.shipSelector,
                        id: "",
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
                cell.setAttribute("data-id", `cell-${r * SIZE + c}`);
                row.appendChild(cell);

                cell.addEventListener("mouseenter", (e) => {
                    const cells = div.querySelectorAll(".cell");
                    cells.forEach((cell) => {
                        cell.classList.remove("hover");
                    });

                    if (cell.classList.contains("hit") || cell.classList.contains("miss"))
                        return;

                    cell.classList.add("hover");
                });

                cell.addEventListener("click", (e) => {
                    if (cell.classList.contains("hit") || cell.classList.contains("miss"))
                        return;

                    const id = e.target.getAttribute("data-id").split("-")[1];
                    const column = Math.floor(id / 10);
                    const row = id % 10;

                    const hit = game.playRound(row, column);
                    if (hit && hit.error)
                        return;

                    if (hit && hit.winner) {
                        if (hit.winner === "computer")
                            drawModal("More luck next time!", "Computer won.");
                        else
                            drawModal("Congratulations, You won!", "Incredible performance.");
                        return;
                    }

                    if (hit)
                        cell.classList.add("hit");
                    else
                        cell.classList.add("miss");

                    cell.removeEventListener("click", this);
                    cell.removeEventListener("mouseenter", this);

                });
            }
            div.appendChild(row);
        }
    };

    const drawModal = (h2Text, pText) => {
        const modal = document.querySelector(".modal-overlay");
        modal.style.display = "flex";
        const h2 = modal.querySelector("h2");
        h2.textContent = h2Text;
        const p = modal.querySelector("p");
        p.textContent = pText;
    };

    return { drawShips, drawGameboard, drawGuesses, drawModal };

};

export { GUI };
