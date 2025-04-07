// NOTE(miha): ships is an map between ship object and its coordinates.
// {Ship(2): {x:2, y:2, dir:left}, ...}

const _SIZE = 10;

const _GRID_DEFAULT = 0;
const _GRID_SHIP = 1;
const _GRID_HIT = 2;
const _GRID_MISS = 3;

const HORIZONTAL = 0;
const VERTICAL = 1;

const _inBound = (r, c) => {
    return (r >= 0 && c >= 0 && r < _SIZE && c < _SIZE);
}

const createGameboardShip = (ship, r, c, direction) => {
    if (direction !== HORIZONTAL && direction !== VERTICAL)
        throw Error("direction must be HORIZONTAL or VERTICAL");

    if (!_inBound(r, c))
        throw Error(`(r,c) not in bounds error`);

    return {
        ship,
        r,
        c,
        direction,
    };
};

const createGameboard = (shipsWithPosition) => {
    // NOTE(miha): We save our ships here. We must have 5 ships of length: 2,3,3,4,5.
    const shipLengths = new Array(10).fill(0);
    const positionMap = new Map();
    const ships = [];

    const _positionMapAdd = (r, c, val) => positionMap.set(`${r},${c}`, val);
    const _positionMapGet = (r, c) => positionMap.get(`${r},${c}`);

    for (const { ship, r, c, direction } of shipsWithPosition) {
        const len = ship.getLength();
        if (len < 0 || len > shipLengths.length)
            throw Error(`ship length error (0 <= ${len} < ${shipLengths.length}`);

        shipLengths[len]++;
        ships.push(ship);

        for (let i = 0; i < len; i++) {
            if (direction === HORIZONTAL) {
                const newR = r;
                const newC = c + i;
                if (!_inBound(newR, newC))
                    throw Error(`(r,c) not in bounds error`);
                if (_positionMapGet(newR, newC))
                    throw Error(`ship already present error`);
                _positionMapAdd(newR, newC, ship);
            } else if (direction === VERTICAL) {
                const newR = r + i;
                const newC = c;
                if (!_inBound(newR, newC))
                    throw Error(`(r,c) not in bounds error`);
                if (_positionMapGet(newR, newC))
                    throw Error(`ship already present error`);
                _positionMapAdd(newR, newC, ship);
            }
        }
    }

    if (ships.length !== 5)
        throw Error(`you must pass 5 ships (5 != ${ships.length}`);

    // NOTE(miha): Check that we have 2,3,3,4,5 ships
    if (shipLengths[2] !== 1 || shipLengths[3] !== 2 || shipLengths[4] !== 1 || shipLengths[5] !== 1)
        throw Error(`you must pass ships with lengths: 2,3,3,4,5`);

    return Gameboard(ships, positionMap);
};

const Gameboard = (ships, positionToShip) => {
    const _ships = ships;
    const _grid = new Array(_SIZE * _SIZE).fill(_GRID_DEFAULT);
    const _positionToShip = positionToShip;

    const _positionToShipGet = (r, c) => _positionToShip.get(`${r},${c}`);

    // NOTE(miha): Fill up grid with ships.
    for (const [key, _] of _positionToShip.entries()) {
        const [r, c] = key.split(",").map((el) => Number(el));
        _grid[r * _SIZE + c] = _GRID_SHIP;
    }

    const receiveAttack = (r, c) => {
        // TODO(miha): So we need to check if (r,c) in bounds?
        if (_grid[r * _SIZE + c] === _GRID_SHIP) {
            _positionToShipGet(r, c).hit();
            _grid[r * _SIZE + c] = _GRID_HIT;
        } else {
            _grid[r * _SIZE + c] = _GRID_MISS;
        }
    };

    const allShipSunk = () => {
        const result = _ships.every((ship) => ship.isSunk());
        return result;
    };

    const getGrid = () => _grid;
    const getGridCell = (r, c) => _grid[r * _SIZE + c];

    return { receiveAttack, allShipSunk, getGrid, getGridCell };
};

export { Gameboard, createGameboardShip, createGameboard, HORIZONTAL, VERTICAL, _GRID_DEFAULT, _GRID_SHIP, _GRID_HIT, _GRID_MISS }; 
