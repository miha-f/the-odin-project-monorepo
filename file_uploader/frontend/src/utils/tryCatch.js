export const tryCatch = async (promise) => {
    try {
        const data = await promise;
        return [data, null];
    } catch (err) {
        if (err.response && err.response.data)
            return [null, err.response.data];

        return [null, { error: err.message || 'Unknown error' }];
    }
};
