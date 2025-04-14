const rockButton = document.querySelector("#rock");
const paperButton = document.querySelector("#paper");
const scissorsButton = document.querySelector("#scissors");
const playAgainButton = document.querySelector("#playAgain");
const humanWins = document.querySelector("#humanWins");
const computerWins = document.querySelector("#computerWins");
const draw = document.querySelector("#draw");

const signs = ["rock", "paper", "scissors"];

let humanScore = 0;
let computerScore = 0;

const reset = () => {
    // NOTE(miha): Reset counts.
    humanScore = 0;
    computerScore = 0;
    updateScore();

    // NOTE(miha): Hide winning text and play again button.
    humanWins.classList.add("invisible");
    computerWins.classList.add("invisible");
    draw.classList.add("invisible");
    playAgainButton.classList.add("invisible");

    // NOTE(miha): Enable rock,paper,scissors buttons again.
    rockButton.disabled = false;
    paperButton.disabled = false;
    scissorsButton.disabled = false;
};

const getComputerChoice = () => {
    const choice = Math.floor(Math.random() * 3);
    return signs[choice];
};

const playRound = (humanChoice, computerChoice) => {
    if (humanChoice === computerChoice)
        return;

    switch (humanChoice) {
        case 'rock':
            if (computerChoice === 'scissors')
                humanScore++;
            else if (computerChoice === 'paper')
                computerScore++;
            break;
        case 'paper':
            if (computerChoice === 'rock')
                humanScore++;
            else if (computerChoice === 'scissors')
                computerScore++;
            break;
        case 'scissors':
            if (computerChoice === 'paper')
                humanScore++;
            else if (computerChoice === 'rock')
                computerScore++;
            break;
    }
};

const updateScore = () => {
    const humanScoreText = document.querySelector("#humanScore");
    const computerScoreText = document.querySelector("#computerScore");
    humanScoreText.textContent = humanScore;
    computerScoreText.textContent = computerScore;
};

rockButton.addEventListener("click", () => { playGame("rock"); });
paperButton.addEventListener("click", () => { playGame("paper"); });
scissorsButton.addEventListener("click", () => { playGame("scissors"); });

const playGame = (humanSelection) => {
    // NOTE(miha): We play until human or computer reaches score of 5.
    if (humanScore < 5 && computerScore < 5) {
        const computerSelection = getComputerChoice();
        playRound(humanSelection, computerSelection);
        updateScore();
    }

    const gameOver = humanScore == 5 || computerScore == 5;
    if (gameOver) {
        if (humanScore > computerScore) {
            humanWins.classList.toggle("invisible");
        }
        else if (computerScore > humanScore) {
            computerWins.classList.toggle("invisible");
        }
        else {
            draw.classList.toggle("invisible");
        }

        playAgainButton.classList.toggle("invisible");
        rockButton.disabled = true;
        paperButton.disabled = true;
        scissorsButton.disabled = true;
    }
}

playAgainButton.addEventListener("click", () => {
    reset();
});
