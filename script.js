const signs = ["rock", "paper", "scissor"];

const getComputerChoice = () => {
    const choice = Math.floor(Math.random() * 3);
    return signs[choice];
};
