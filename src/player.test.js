import { Ship } from "./ship.js";
import { Player } from "./player.js";
import { HORIZONTAL } from "./gameboard.js";

test('player', () => {
    const p1 = Player();
    p1.getGameboard().addShip(Ship(2), 0, 0, HORIZONTAL);

    const p2 = Player();
    p2.getGameboard().addShip(Ship(2), 0, 0, HORIZONTAL);

    expect(p1.addGuess(p2, 0, 0)).toBe(true);
    expect(p1.addGuess(p2, 0, 0)).toBe(false);
    expect(p1.addGuess(p2, 0, 3)).toBe(false);
    expect(p2.addGuess(p1, 0, 0)).toBe(true);
    expect(p2.addGuess(p1, 0, 3)).toBe(false);
});
