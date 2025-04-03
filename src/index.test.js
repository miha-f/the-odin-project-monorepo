import { sum, capitalize, reverseString, calculator, caesarCipher } from "./index.js";

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('capitalize', () => {
    expect(capitalize("")).toBe("");
    expect(capitalize("ann")).toBe("Ann");
    expect(capitalize("Ann")).toBe("Ann");
    expect(capitalize("today is friday.")).toBe("Today is friday.");
    expect(capitalize("123")).toBe("123");
});

test('reverseString', () => {
    expect(reverseString("")).toBe("");
    expect(reverseString("ann")).toBe("nna");
    expect(reverseString("Ann")).toBe("nnA");
    expect(reverseString("today is friday.")).toBe(".yadirf si yadot");
    expect(reverseString("123")).toBe("321");
});

test('calculator', () => {
    const calc = calculator();
    expect(calc.add(4, 2)).toBe(6);
    expect(calc.subtract(4, 2)).toBe(2);
    expect(calc.divide(4, 2)).toBe(2);
    expect(calc.multiply(4, 2)).toBe(8);
});

test('caesarCipher', () => {
    expect(caesarCipher("", 3)).toBe("");
    expect(caesarCipher('xyz', 3)).toBe("abc");
    expect(caesarCipher('HeLLo', 3)).toBe("KhOOr");
    expect(caesarCipher('Hello, World!', 3)).toBe("Khoor, Zruog!");
});
