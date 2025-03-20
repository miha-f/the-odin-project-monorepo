
/*

    + - * /
    0 1 2 3
    4 5 6 7
    8 9 . <

*/

const screenOutput = document.querySelector("#screen");

const zeroButton = document.querySelector("#zero");
const oneButton = document.querySelector("#one");
const twoButton = document.querySelector("#two");
const threeButton = document.querySelector("#three");
const fourButton = document.querySelector("#four");
const fiveButton = document.querySelector("#five");
const sixButton = document.querySelector("#six");
const sevenButton = document.querySelector("#seven");
const eightButton = document.querySelector("#eight");
const nineButton = document.querySelector("#nine");

const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");
const multiplicationButton = document.querySelector("#multiplication");
const divisionButton = document.querySelector("#division");
const commaButton = document.querySelector("#comma");
const clearButton = document.querySelector("#clear");
const deleteButton = document.querySelector("#delete");
const equalButton = document.querySelector("#equal");
const signButton = document.querySelector("#sign");

const calculator = { screen: undefined, operator: undefined, numberA: undefined, numberB: undefined };

// we need number so op can work on it
// repeted ops -> do it on the number on screen
// 

const addNumberToScreen = (digit) => {
    if (screenOutput.value.length >= 8)
        return;

    screenOutput.value += `${digit}`;
    calculator.screen = parseInt(screenOutput.value);
};

const zero = () => { addNumberToScreen(0); };
const one = () => { addNumberToScreen(1); };
const two = () => { addNumberToScreen(2); };
const three = () => { addNumberToScreen(3); };
const four = () => { addNumberToScreen(4); };
const five = () => { addNumberToScreen(5); };
const six = () => { addNumberToScreen(6); };
const seven = () => { addNumberToScreen(7); };
const eight = () => { addNumberToScreen(8); };
const nine = () => { addNumberToScreen(9); };

const op_plus = () => { };
const op_minus = () => { };
const op_multiplication = () => { };
const op_division = () => { };
const op_comma = () => { };
const op_clear = () => { screenOutput.value = ""; };
const op_backspace = () => { };
const op_equal = () => { };
const op_sign = () => { };

zeroButton.addEventListener("click", () => zero());
oneButton.addEventListener("click", () => one());
twoButton.addEventListener("click", () => two());
threeButton.addEventListener("click", () => three());
fourButton.addEventListener("click", () => four());
fiveButton.addEventListener("click", () => five());
sixButton.addEventListener("click", () => six());
sevenButton.addEventListener("click", () => seven());
eightButton.addEventListener("click", () => eight());
nineButton.addEventListener("click", () => nine());

plusButton.addEventListener("click", () => op_plus());
minusButton.addEventListener("click", () => op_minus());
multiplicationButton.addEventListener("click", () => op_multiplication());
divisionButton.addEventListener("click", () => op_division());
commaButton.addEventListener("click", () => op_comma());
clearButton.addEventListener("click", () => op_clear());
deleteButton.addEventListener("click", () => op_delete());
equalButton.addEventListener("click", () => op_equal());
signButton.addEventListener("click", () => op_sign());

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case '0': zero(); break;
        case '1': one(); break;
        case '2': two(); break;
        case '3': three(); break;
        case '4': four(); break;
        case '5': five(); break;
        case '6': six(); break;
        case '7': seven(); break;
        case '8': eight(); break;
        case '9': nine(); break;

        case '+': op_plus(); break;
        case '-': op_minus(); break;
        case '*': op_multiplication(); break;
        case '/': op_division(); break;
        case ',': op_comma(); break;
        case 'C':
        case 'c': op_clear(); break;
        case 'Backspace': op_backspace(); break;
        case '=': op_equal(); break;
        case 'S':
        case 's':
        case '%': op_sign(); break;

        default: console.log(event.key);
    }
});
