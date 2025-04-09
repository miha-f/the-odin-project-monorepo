const State = () => {
    let shipSelector = {
        id: "",
        rotate: false,
        length: -1,
        cells: [],
    };
    let shipCount = 0;

    return { shipSelector, shipCount };
};

export { State };
