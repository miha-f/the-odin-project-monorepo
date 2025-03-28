// TODO(miha): When we have winner, game should disable -> all buttons

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
        for (var i = 0; i < 9; i++)
            gameboard.push(undefined);

        const buttons = _getGameboardButtons();
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.setAttribute("data-id", i);
            button.addEventListener("click", (e) => {
                e.target.disabled = true;
                e.target.textContent = currentPlayer;
                const id = e.target.getAttribute("data-id");
                gameboard[id] = currentPlayer;

                playRound();

                _switchCurrentPlayer();
            });
        }

        currentPlayer = _getStartingPlayer();

        const startingPlayerText = document.querySelector("#starting-player");
        startingPlayerText.textContent = `${currentPlayer} starts`;
    };

    const playRound = () => {
        const winner = _checkWinner();

        if (winner === "X")
            xWins++;

        if (winner === "O")
            oWins++;

        if (winner === "X" || winner === "O")
            _victoryScreen(winner);

        // NOTE(miha): Game is a draw.
        if (!gameboard.includes(undefined) && winner === undefined)
            _victoryScreen("draw");
    };

    const reset = () => {
        gameboard.length = 0;
        // currentPlayer = "";
        // TODO(miha): Do we need to remove event listener?
        const buttons = _getGameboardButtons();
        console.log(buttons);
        for (const button of buttons) {
            button.disabled = false;
            button.textContent = "";
        }
    };

    const getXWins = () => xWins;
    const getOWins = () => oWins;

    const _getGameboardButtons = () => {
        const buttons = document.querySelectorAll("button");
        return [...buttons].filter((button) => button.id !== "play-again");
    }
    const _victoryScreen = (winner) => {
        if (winner === "X") {
            console.log("x wins?");
            const playerX = document.querySelector("#player-x-score");
            playerX.textContent = `X wins: ${getXWins()}`;
        }
        if (winner === "O") {
            console.log("o wins?");
            const playerO = document.querySelector("#player-o-score");
            playerO.textContent = `O wins: ${getOWins()}`;
        }

        const victoryDiv = document.querySelector("#victory-message");
        victoryDiv.style["visibility"] = "visible";
        const victoryMessage = document.querySelector("#victory-message>h2");
        victoryMessage.textContent = winner !== "draw" ? `${winner} wins!` : "Draw!";
    };
    const _switchCurrentPlayer = () => currentPlayer === "X" ? currentPlayer = "O" : currentPlayer = "X";
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
                if (gameboard[i] == ch && gameboard[i + SIZE] == ch && gameboard[i + (SIZE * 2)] == ch)
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
        }
        return undefined;
    };

    return { init, playRound, reset, getXWins, getOWins };
})();

const gui = (function() {
})();

const playAgainButton = document.querySelector("#play-again");
playAgainButton.addEventListener('click', (e) => {
    game.reset();
    game.init();
});

game.init();

// TODO(miha): Currently code is "coupled" we do everything in "module game".
// Game should only be concered about game and we should put GUI on top of it.
// If we can't interact from GUI with game we should add method to be able to do so.
