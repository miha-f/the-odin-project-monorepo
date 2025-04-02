
const HashMap = (capacity = 16, loadFactor = 0.75) => {
    const _buckets = new Array(capacity).fill(undefined);

    const _at = (index) => {
        if (index < 0 || index >= _buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }
        return _buckets[index];
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

    const set = (key, value) => {
        // TODO(miha): Need to grow if hash map exceed loadFactor
        const hashed = hash(key);

        if (_at(hashed) === undefined)
            _buckets[hashed] = [];

        const bucket = _at(hashed);
        let index = -1;
        for (let i = 0; i < bucket.length; i++)
            if (bucket[i].key === key)
                index = i;

        if (index !== -1)
            bucket[index] = { key, value };
        else
            bucket.push({ key, value });
    };

    const get = (key) => {
        const hashed = hash(key);

        const bucket = _at(hashed);
        let index = -1;
        for (let i = 0; i < bucket.length; i++)
            if (bucket[i].key === key)
                index = i;

        return index !== -1 ? index : null;
    };

    const has = (key) => {
        return get(key) !== null;
    };

    const remove = (key) => {
        const hashed = hash(key);

        if (_at(hashed) === undefined)
            return;

        const bucket = _at(hashed);
        let index = -1;
        for (let i = 0; i < bucket.length; i++)
            if (bucket[i].key === key)
                index = i;

        if (index !== -1) {
            bucket.splice(index, 1);
            return true;
        } else
            return false;
    };

    const length = () => { };

    const clear = () => { };

    const keys = () => { };

    const values = () => { };

    const entries = () => { };

    return {
        hash, set, get, has, remove, length, clear, keys, values, entries,
        _buckets // TODO(miha): remove me!
    };
}

export { HashMap };
