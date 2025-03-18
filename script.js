const signs = ["rock", "paper", "scissor"];

let humanScore = 0;
let computerScore = 0;

const getComputerChoice = () => {
    const choice = Math.floor(Math.random() * 3);
    return signs[choice];
};

const getHumanChoice = () => {
    return prompt("Enter your sign, valid options: rock, paper, scissor");
};

const playRound = (humanChoice, computerChoice) => {
    if (humanChoice === computerChoice)
        return;

    switch (humanChoice) {
        case 'rock':
            if (computerChoice === 'scissor')
                humanScore++;
            else if (computerChoice === 'paper')
                computerScore++;
            break;
        case 'paper':
            if (computerChoice === 'rock')
                humanScore++;
            else if (computerChoice === 'scissor')
                computerScore++;
            break;
        case 'scissor':
            if (computerChoice === 'paper')
                humanScore++;
            else if (computerChoice === 'rock')
                computerScore++;
            break;
    }
};

const playGame = () => {
    for (let i = 0; i < 5; i++) {
        const humanSelection = getHumanChoice();
        const computerSelection = getComputerChoice();
        playRound(humanSelection, computerSelection);
    }

    if (humanScore > computerScore)
        console.log("human wins");
    else if (computerScore > humanScore)
        console.log("computer wins");
    else
        console.log("its a draw");
}

playGame();
