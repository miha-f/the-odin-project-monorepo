const sum = (a, b) => {
    return a + b;
}

const capitalize = (s) => {
    return s ? String(s[0]).toUpperCase() + String(s).slice(1) : "";
}

const reverseString = (s) => {
    return s.split("").reverse().join("");
}

const calculator = () => {

    const add = (a, b) => a + b;
    const subtract = (a, b) => a - b;
    const divide = (a, b) => a / b;
    const multiply = (a, b) => a * b;

    return { add, subtract, divide, multiply };
}

export { sum, capitalize, reverseString, calculator }
