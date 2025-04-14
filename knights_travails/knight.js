const knightMoves = (from, to) => {
    const GRID_SIZE = 8;

    const dirs = [
        [-1, 2], [-1, -2], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [2, 1], [2, -1]
    ];

    let minMoves = 100;
    let minPath = [];

    const inBound = (pos) => {
        return (pos[0] >= 0 && pos[1] >= 0 && pos[0] < GRID_SIZE && pos[1] < GRID_SIZE);
    }

    let visited = new Set();
    // NOTE(miha): Need to convert point to string, otherwise we save position
    // reference and not actual position.
    const addVisited = (x, y) => visited.add(`${x},${y}`);
    const hasVisited = (x, y) => visited.has(`${x},${y}`);
    const removeVisited = (x, y) => visited.delete(`${x},${y}`);

    let cache = new Map();

    const dfs = (pos, moves = 0, path = []) => {
        if (pos[0] === to[0] && pos[1] === to[1]) {
            if (moves < minMoves) {
                minMoves = moves;
                minPath = path.slice();
            }
            return;
        }

        const key = `${pos[0]},${pos[1]}`;
        if (cache.has(key) && cache.get(key) <= moves) {
            return;
        }
        cache.set(key, moves);

        for (const dir of dirs) {
            let newPos = [0, 0];
            newPos[0] = pos[0] + dir[0];
            newPos[1] = pos[1] + dir[1];

            if (inBound(newPos) && !hasVisited(newPos[0], newPos[1])) {
                addVisited(newPos[0], newPos[1]);
                path.push([...newPos]);
                dfs(newPos, moves + 1, path);
                path.pop();
                removeVisited(newPos[0], newPos[1]);
            }
        }
    };

    dfs(from);

    return [from, ...minPath];
};

export { knightMoves };
