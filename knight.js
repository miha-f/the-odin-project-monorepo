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

    const dfs = (pos, moves = 0, path = []) => {
        for (const dir of dirs) {
            let newPos = pos;
            newPos[0] += dir[0];
            newPos[1] += dir[1];

            if (visited.has(newPos))
                continue;

            if (newPos === to) {
                if (moves < minMoves) {
                    minMoves = moves;
                    minPath = path;
                }
            }

            if (inBound(newPos)) {
                visited.add(newPos);
                dfs(newPos, moves + 1, path.push(newPos));
            }

            visited.delete(newPos);
        }
    };

    dfs(from);

    return minPath;
};

export { knightMoves };
