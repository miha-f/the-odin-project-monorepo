import { Player } from "./player.js";
import { Gameboard, SIZE, GRID_DEFAULT } from "./gameboard.js";

const Game = () => {
    const _playerGameboard = Gameboard();
    const _computerGameboard = Gameboard();
    const _player = Player(_playerGameboard);
    const _computer = Player(_computerGameboard);

    const getPlayer = () => _player;
    const getComputer = () => _computer;

    // TODO: Init computer gameboard with randomly placed ships

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const init = (function() {
        const rules = _computer.getGameboard().getRules();
        // NOTE(miha): Generate random ships for computer.
        for (const [shipLength, numberOfShips] of Object.entries(rules.shipToCountMap)) {
            for (let i = 0; i < numberOfShips; i++) {
                let placed = false;
                while (!placed) {
                    const row = getRandomInt(0, SIZE);
                    const column = getRandomInt(0, SIZE);
                    const direction = getRandomInt(0, 1);
                    const err = _computer.getGameboard().addShip(shipLength, row, column, direction);
                    placed = err === undefined;
                }
            }
        }
    })();

    const readyToPlay = () => {
        return _player.getGameboard().ready();
    }

    const addPlayerShip = (length, r, c, direction) => {
        const err = _player.getGameboard().addShip(length, r, c, direction);
        return err;
    };

    const printGameboard = (gameboard) => {
        let line = "";
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                line += `${gameboard.getGridCell(r, c)}, `;
            }
            line += "\n";
        }
        console.log(line);
    }

    const playRound = (r, c) => {
        if (!readyToPlay())
            return { error: "place your ships first" };

        const playerAttack = _player.attack(_computer, r, c);

        // NOTE(miha): simulate computer attack
        let computerRow = getRandomInt(0, SIZE - 1);
        let computerColumn = getRandomInt(0, SIZE - 1);
        _computer.attack(_player, computerRow, computerColumn);

        console.log("PLAYER:");
        printGameboard(_player.getGameboard());

        console.log("COMPUTER:");
        printGameboard(_computer.getGameboard());

        const playerLost = _player.getGameboard().allShipSunk();
        const computerLost = _computer.getGameboard().allShipSunk();
        if (playerLost || computerLost) {
            // display winner modal + reset button
        }

        return playerAttack;
    };

    return { getPlayer, getComputer, playRound, addPlayerShip, readyToPlay };
};

export { Game };
