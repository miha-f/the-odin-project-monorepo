import { Ship } from "./ship.js";

test('ship', () => {
    const smallShip = Ship(2);
    smallShip.hit();
    expect(smallShip.isSunk()).toBe(false);
    smallShip.hit();
    expect(smallShip.isSunk()).toBe(true);
    smallShip.hit();
    expect(smallShip.isSunk()).toBe(true);

    const bigShip = Ship(5);
    bigShip.hit();
    bigShip.hit();
    bigShip.hit();
    bigShip.hit();
    expect(bigShip.isSunk()).toBe(false);
    bigShip.hit();
    expect(bigShip.isSunk()).toBe(true);
});
