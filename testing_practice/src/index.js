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

const caesarCipher = (s, shift) => {
    const isAscii = (c) => {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }

    const getShiftedChar = (c) => {
        let offset = 0;
        if (c >= 'a' && c <= 'z')
            offset = 97;
        else
            offset = 65;

        return String.fromCharCode(((c.charCodeAt(0) - offset + shift) % 26) + offset)
    }

    let result = "";
    for (const c of s) {
        if (isAscii(c)) {
            result += getShiftedChar(c);
        }
        else {
            result += c;
        }
    }

    return result;
}

const analyzeArray = (arr) => {
    const average = arr.reduce((a, b) => a + b, 0) / arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const length = arr.length;

    return { average, min, max, length };
}

export { sum, capitalize, reverseString, calculator, caesarCipher, analyzeArray }
