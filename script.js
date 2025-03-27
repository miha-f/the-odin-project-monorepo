
// game-> arr with x or o or undefined
// game-> after click check if we have winner


const game = (function() {
    // NOTE(miha): How is the gameboard constructed.
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const SIZE = 3;
    const gameboard = [];
    let xWins = 0;
    let oWins = 0;
    let currentPlayer = "";

    const init = () => {
        reset();
        // TODO(miha): asign all stuff to buttons (eventListener, id?)
        currentPlayer = _getStartingPlayer();
    };

    const playRound = () => {
        const winner = _checkWinner();
    };

    const reset = () => {
        for (var i = 0; i < 9; i++)
            gameboard.push(undefined);
    };

    const getXWins = () => xWins;
    const getOWins = () => oWins;

    const _getStartingPlayer = () => Math.random() > 0.5 ? "X" : "O";
    const _checkWinner = () => {
        _checkRow = (ch) => {
            for (var r = 0; r < 3; r++) {
                const i = r * SIZE;
                if (gameboard[i] == ch && gameboard[i + 1] == ch && gameboard[i + 2] == ch)
                    return true;
            }
            return false;
        };
        _checkColumn = (ch) => {
            for (var c = 0; c < 3; c++) {
                const i = c;
                if (gameboard[i] == ch && gameboard[i + SIZE] == ch && gameboard[i + SIZE] == ch)
                    return true;
            }
            return false;
        };
        _checkDiagonal = (ch) => {
            if (gameboard[0] == ch && gameboard[4] == ch && gameboard[8] == ch)
                return true;
            if (gameboard[2] == ch && gameboard[4] == ch && gameboard[6] == ch)
                return true;
            return false
        };
        for (const c of "XO") {
            if (_checkRow(c))
                return c;
            if (_checkColumn(c))
                return c;
            if (_checkDiagonal(c))
                return c;
            return undefined;
        }
    };

    return { init, playRound, reset, getXWins, getOWins };
})();
