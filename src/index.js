const sum = (a, b) => {
    return a + b;
}

const capitalize = (s) => {
    return s ? String(s[0]).toUpperCase() + String(s).slice(1) : "";
}

export { sum, capitalize }
