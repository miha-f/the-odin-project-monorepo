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

const Gameboard = (rules = _defaultGameboardRules) => {
    const _grid = new Array(_SIZE * _SIZE).fill(_GRID_DEFAULT);

    const _positionToShip = new Map();
    const _positionToShipGet = (r, c) => _positionToShip.get(`${r},${c}`);
    const _positionToShipSet = (r, c, val) => _positionToShip.set(`${r},${c}`, val);

    // NOTE(miha): Here we store ships based on their length (i.e. 3: [Ship(3), Ship(3)]).
    // We need to make sure that we follow given rules (i.e. only 2 ships of len 3 for default rules).
    let _lengthToShip = new Map();

    const addShip = (ship, r, c, direction) => {
        const len = ship.getLength();

        // NOTE(miha): Check rules for total number of ships.
        const shipsLength = Array.from(_lengthToShip.values()).reduce((sum, arr) => sum + arr.length, 0);
        if (shipsLength.length > rules.numberOfShipsAtStart)
            return { error: "too many ships" };

        // NOTE(miha): Check rules for specific length (i.e. if we can add ship of such length).
        if (!_lengthToShip.has(len))
            _lengthToShip.set(len, []);
        if (!(`${len}` in rules.shipToCountMap))
            return { error: "ship length not present in rules" };
        if (_lengthToShip.get(len).length >= rules.shipToCountMap[len])
            return { error: "too much ships of same length" };

        if (direction !== HORIZONTAL && direction !== VERTICAL)
            return { error: "direction must be HORIZONTAL or VERTICAL" };

        // NOTE(miha): Check if given ship is fully in bounds (start and end).
        if (!_inBound(r, c))
            return { error: "(r,c) not in bounds error" };
        if (direction === HORIZONTAL && !_inBound(r, c + len))
            return { error: "(r,c) not in bounds error" };
        if (direction === VERTICAL && !_inBound(r + len, c))
            return { error: "(r,c) not in bounds error" };

        // NOTE(miha): Check if we can place ship on the grid (it is not occupied).
        // If we can we also place ship on the grid. If this block returns error,
        // grid is not usable.
        for (let i = 0; i < len; i++) {
            if (direction === HORIZONTAL) {
                const newR = r;
                const newC = c + i;
                if (!_inBound(newR, newC))
                    return { error: "(r,c) not in bounds error" };
                if (_positionToShipGet(newR, newC))
                    return { error: "ship already present error" };
                _positionToShipSet(newR, newC, ship);
                _grid[newR * _SIZE + newC] = _GRID_SHIP;
            } else if (direction === VERTICAL) {
                const newR = r + i;
                const newC = c;
                if (!_inBound(newR, newC))
                    return { error: "(r,c) not in bounds error" };
                if (_positionToShipGet(newR, newC))
                    return { error: "ship already present error" };
                _positionToShipSet(newR, newC, ship);
                _grid[newR * _SIZE + newC] = _GRID_SHIP;
            }
        }

        _lengthToShip.get(ship.getLength()).push(ship);
    };

    const receiveAttack = (r, c) => {
        if (!_inBound(newR, newC))
            return { error: "(r,c) not in bounds error" };

        if (_grid[r * _SIZE + c] === _GRID_SHIP) {
            _positionToShipGet(r, c).hit();
            _grid[r * _SIZE + c] = _GRID_HIT;
        } else {
            _grid[r * _SIZE + c] = _GRID_MISS;
        }
    };

    const allShipSunk = () => {
        const ships = Array.from(_lengthToShip.values()).reduce((acc, curr) => acc.concat(curr), []);
        const result = ships.every((ship) => ship.isSunk());
        return result;
    };

    const getGrid = () => _grid;
    const getGridCell = (r, c) => _grid[r * _SIZE + c];

    return { receiveAttack, allShipSunk, getGrid, getGridCell, addShip };
};

export { Gameboard, HORIZONTAL, VERTICAL, _GRID_DEFAULT, _GRID_SHIP, _GRID_HIT, _GRID_MISS }; 
