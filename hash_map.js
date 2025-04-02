
const HashMap = (capacity = 16, loadFactor = 0.75) => {
    const _buckets = [];

    const _at = (index) => {
        if (index < 0 || index >= _buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }
    }

    const hash = (key) => {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode %= _buckets.length;
        }

        return hashCode;
    };

    const set = (key, value) => { };

    const get = (key) => { };

    const has = (key) => { };

    const remove = (key) => { };

    const length = () => { };

    const clear = () => { };

    const keys = () => { };

    const values = () => { };

    const entries = () => { };

    return { hash, set, get, has, remove, length, clear, keys, values, entries };
}

export { HashMap };
