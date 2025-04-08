import { Gameboard, SIZE, GRID_DEFAULT, GRID_HIT, GRID_MISS } from "./gameboard.js";

// player has own gameboar and own gueses (grid for other player)
// need to have API (addShip, addGuess)
const Player = () => {
    const _gameboard = Gameboard();
    const _guesses = new Array(SIZE * SIZE).fill(GRID_DEFAULT);

    const getGameboard = () => _gameboard;

    const addGuess = (otherPlayer, r, c) => {
        otherPlayer.getGameboard().receiveAttack(r, c);
        const cell = otherPlayer.getGameboard().getGridCell(r, c);
        if (cell === GRID_HIT) {
            _guesses[r * SIZE + c] = GRID_HIT;
            return true;
        } else {
            _guesses[r * SIZE + c] = GRID_MISS;
            return false;
        }
    };

    return { getGameboard, addGuess };
};

export { Player };
