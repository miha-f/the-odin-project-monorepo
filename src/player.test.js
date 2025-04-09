import { Player } from "./player.js";
import { Gameboard, HORIZONTAL } from "./gameboard.js";

test('player', () => {
    const g1 = Gameboard();
    const p1 = Player(g1);
    p1.getGameboard().addShip(2, 0, 0, HORIZONTAL);

    const g2 = Gameboard();
    const p2 = Player(g2);
    p2.getGameboard().addShip(2, 0, 0, HORIZONTAL);

    expect(p1.attack(p2, 0, 0)).toBe(true);
    expect(p1.attack(p2, 0, 0)).toBe(false);
    expect(p1.attack(p2, 0, 3)).toBe(false);
    expect(p2.attack(p1, 0, 0)).toBe(true);
    expect(p2.attack(p1, 0, 3)).toBe(false);
});
