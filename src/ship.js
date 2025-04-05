const Ship = (length) => {
    const _length = length;
    let _hit = 0;

    const hit = () => {
        _hit++;
    };

    const isSunk = () => {
        return _hit >= _length;
    };

    return { hit, isSunk };
}

export { Ship };
