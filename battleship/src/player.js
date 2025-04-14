import { SIZE, GRID_DEFAULT, GRID_HIT, GRID_MISS } from "./gameboard.js";

// player has own gameboar and own gueses (grid for other player)
// need to have API (addShip, addGuess)
const Player = (gameboard) => {
    const _gameboard = gameboard;

    const getGameboard = () => _gameboard;

    const attack = (otherPlayer, r, c) => {
        otherPlayer.getGameboard().receiveAttack(r, c);
        const cell = otherPlayer.getGameboard().getGridCell(r, c);
        if (cell === GRID_HIT) {
            return true;
        } else {
            return false;
        }
    };

    return { getGameboard, attack };
};

export { Player };
