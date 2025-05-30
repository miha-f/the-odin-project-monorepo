export const getHumanSize = (size) => {
    if (size > (1 << 30))
        return `${(size / (1 << 30)).toFixed(2)} GB`;
    if (size > (1 << 20))
        return `${(size / (1 << 20)).toFixed(2)} MB`;
    if (size > (1 << 10))
        return `${(size / (1 << 10)).toFixed(2)} KB`;
    return `${size} B`;
};
