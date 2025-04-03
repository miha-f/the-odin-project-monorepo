import { sum, capitalize } from "./index.js";

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
