const withCatch = async (fn) => {
    try {
        return [null, await fn()];
    } catch (err) {
        return [err, null];
    }
};

export default withCatch;
