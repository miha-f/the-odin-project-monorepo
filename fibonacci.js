const fibs = (n) => {
    if (n === 1)
        return [0];
    if (n === 2)
        return [0, 1];

    const arr = [0, 1];
    for (let i = 2; i < n; i++)
        arr.push(arr[i - 1] + arr[i - 2]);

    return arr;
}

const fibsRec = (n, arr = [0, 1]) => {
    if (arr.length > n)
        return arr.slice(0, n);

    arr.push(arr.at(-1) + arr.at(-2));
    return fibsRec(n, arr);
}

export { fibs, fibsRec };
