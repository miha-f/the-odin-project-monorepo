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
let round = 0;

const reset = () => {
    humanScore = 0;
    computerScore = 0;
    round = 0;
    humanWins.classList.add("invisible");
    computerWins.classList.add("invisible");
    draw.classList.add("invisible");
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
    // NOTE(miha): We play 5 rounds
    if (round < 5) {
        const computerSelection = getComputerChoice();
        playRound(humanSelection, computerSelection);
        round++;
        updateScore();
    } else {
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
    }
}

playAgainButton.addEventListener("click", () => {
    reset();
});
