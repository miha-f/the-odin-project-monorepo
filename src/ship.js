const Ship = (length) => {
    const _length = length;
    let _hit = 0;

    const hit = () => {
        _hit++;
    };

    const isSunk = () => {
        return _hit >= _length;
    };

    const getLength = () => _length;

    return { hit, isSunk, getLength };
}

export { Ship };
