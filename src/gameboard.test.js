import { Ship } from "./ship.js";
import { Gameboard, createGameboardShip, createGameboard, HORIZONTAL, VERTICAL, _GRID_DEFAULT, _GRID_SHIP, _GRID_HIT, _GRID_MISS } from "./gameboard.js";

test('gameboard', () => {
    const gameboard = createGameboard(
        [
            createGameboardShip(Ship(2), 0, 0, HORIZONTAL),
            createGameboardShip(Ship(3), 0, 3, HORIZONTAL),
            createGameboardShip(Ship(3), 1, 2, VERTICAL),
            createGameboardShip(Ship(4), 4, 3, HORIZONTAL),
            createGameboardShip(Ship(5), 1, 0, VERTICAL),
        ]
    );

    // no ship at 0,2
    expect(gameboard.getGridCell(0, 2)).toBe(_GRID_DEFAULT);
    gameboard.receiveAttack(0, 2);
    expect(gameboard.getGridCell(0, 2)).toBe(_GRID_MISS);

    // ship at 0,0
    expect(gameboard.getGridCell(0, 0)).toBe(_GRID_SHIP);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.getGridCell(0, 0)).toBe(_GRID_HIT);
    expect(gameboard.allShipSunk()).toBe(false);

    // destory 2 ship
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);

    // destory 3 ship
    gameboard.receiveAttack(0, 3);
    gameboard.receiveAttack(0, 4);
    gameboard.receiveAttack(0, 5);

    // destroy 3 ship
    gameboard.receiveAttack(1, 2);
    gameboard.receiveAttack(2, 2);
    gameboard.receiveAttack(3, 2);

    // destroy 4 ship
    gameboard.receiveAttack(4, 3);
    gameboard.receiveAttack(4, 4);
    gameboard.receiveAttack(4, 5);
    gameboard.receiveAttack(4, 6);

    // destroy 5 ship
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(2, 0);
    gameboard.receiveAttack(3, 0);
    gameboard.receiveAttack(4, 0);
    gameboard.receiveAttack(5, 0);

    expect(gameboard.allShipSunk()).toBe(true);
});
