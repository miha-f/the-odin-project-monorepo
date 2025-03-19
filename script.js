const rockButton = document.querySelector("#rock");
const paperButton = document.querySelector("#paper");
const scissorsButton = document.querySelector("#scissors");
const playAgainButton = document.querySelector("#playAgain");

const signs = ["rock", "paper", "scissors"];

let humanScore = 0;
let computerScore = 0;
let round = 0;

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

rockButton.addEventListener("click", () => { playGame("rock"); });
paperButton.addEventListener("click", () => { playGame("paper"); });
scissorsButton.addEventListener("click", () => { playGame("scissors"); });

const playGame = (humanSelection) => {
    // NOTE(miha): We play 5 rounds
    if (round < 5) {
        const computerSelection = getComputerChoice();
        playRound(humanSelection, computerSelection);
        round++;
    } else {
        if (humanScore > computerScore)
            console.log("human wins");
        else if (computerScore > humanScore)
            console.log("computer wins");
        else
            console.log("its a draw");
    }
}
