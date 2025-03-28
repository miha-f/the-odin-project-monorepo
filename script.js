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

        currentPlayer = _getStartingPlayer();
    };

    const playRound = () => {
        const winner = _checkWinner();

        if (winner === "X" || winner === "O") {
            _increaseWinnerScore(winner);
            return winner;
        }

        // NOTE(miha): Game is a draw.
        if (!gameboard.includes(undefined) && winner === undefined)
            return "draw";

        _switchCurrentPlayer();
    };

    const reset = () => {
        gameboard.length = 0;

    };

    const setGameboard = (id) => {
        gameboard[id] = currentPlayer;
    };

    const getXWins = () => xWins;
    const getOWins = () => oWins;
    const getCurrentPlayer = () => currentPlayer;

    const _increaseWinnerScore = (winner) => winner === "X" ? xWins++ : oWins++;
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

    return { init, playRound, reset, getXWins, getOWins, getCurrentPlayer, setGameboard };
})();

// NOTE(miha): gui talks with DOM.
const gui = (function() {
    const init = () => {
        game.init();
        _startingPlayerText.textContent = `${game.getCurrentPlayer()} starts`;

        const buttons = _getGameboardButtons();
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.setAttribute("data-id", i);
            button.addEventListener("click", (e) => {
                e.target.disabled = true;
                e.target.textContent = game.getCurrentPlayer();
                const id = e.target.getAttribute("data-id");
                game.setGameboard(id);
                const winner = game.playRound();
                switch (winner) {
                    case "X":
                    case "O":
                    case "draw":
                        _disableButtons();
                        _victoryScreen(winner);
                        break;
                    default: break;
                }
            });
        }

    };

    const _reset = () => {
        currentPlayer = "";
        const buttons = _getGameboardButtons();
        for (const button of buttons) {
            button.disabled = false;
            button.textContent = "";
        }

        _victoryMessageDiv.style["visibility"] = "hidden";
    };

    const _startingPlayerText = document.querySelector("#starting-player");
    const _xPlayerScoreText = document.querySelector("#player-x-score");
    const _oPlayerScoreText = document.querySelector("#player-o-score");
    const _victoryMessageDiv = document.querySelector("#victory-message");
    const _victoryMessageText = document.querySelector("#victory-message>h2");
    const _playAgainButton = document.querySelector("#play-again");

    _playAgainButton.addEventListener('click', (e) => {
        _reset();
        game.reset();
        game.init();
    });

    const _getGameboardButtons = () => {
        const buttons = document.querySelectorAll("button");
        return [...buttons].filter((button) => button.id !== "play-again");
    }

    const _disableButtons = () => {
        const buttons = _getGameboardButtons();
        for (const button of buttons) {
            button.disabled = true;
        }
    }

    const _victoryScreen = (winner) => {
        if (winner === "X")
            _xPlayerScoreText.textContent = `X wins: ${game.getXWins()}`;
        if (winner === "O")
            _oPlayerScoreText.textContent = `O wins: ${game.getOWins()}`;

        _victoryMessageDiv.style["visibility"] = "visible";
        _victoryMessageText.textContent = winner !== "draw" ? `${winner} wins!` : "Draw!";
    };

    return { init };
})();

gui.init();
