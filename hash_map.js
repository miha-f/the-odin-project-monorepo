const HashMap = (capacity = 16, loadFactor = 0.75) => {
    let _buckets = new Array(capacity).fill(undefined);
    let _size = 0;
    let _capacity = capacity;
    let _loadFactor = loadFactor;

    const _at = (index) => {
        if (index < 0 || index >= _buckets.length) {
            throw new Error("Trying to access index out of bounds");
        }
        return _buckets[index];
    }

    const _grow = () => {
        _size = 0;
        _capacity *= 2;
        const vals = entries();
        _buckets = new Array(_capacity).fill(undefined);
        for (let el of vals) {
            const [key, value] = el;
            set(key, value);
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

    const set = (key, value) => {
        if (_size > _capacity * _loadFactor) {
            _grow();
        }

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
        else {
            bucket.push({ key, value });
            _size++;
        }
    };

    const get = (key) => {
        const hashed = hash(key);

        const bucket = _at(hashed) || [];
        let index = -1;
        for (let i = 0; i < bucket.length; i++)
            if (bucket[i].key === key)
                index = i;

        return index !== -1 ? bucket[index].value : null;
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
            _size--;
            return true;
        } else
            return false;
    };

    const length = () => _size;

    const clear = () => {
        _buckets = new Array(_capacity).fill(undefined);
        _size = 0;
    };

    const keys = () => {
        const result = [];
        for (let i = 0; i < _buckets.length; i++)
            for (let el of (_buckets[i] || []))
                result.push(el.key);

        return result;
    };

    const values = () => {
        const result = [];
        for (let i = 0; i < _buckets.length; i++)
            for (let el of (_buckets[i] || []))
                result.push(el.value);

        return result;
    };

    const entries = () => {
        const result = [];
        for (let i = 0; i < _buckets.length; i++)
            for (let el of (_buckets[i] || []))
                result.push([el.key, el.value]);

        return result;
    };

    return {
        hash, set, get, has, remove, length, clear, keys, values, entries,
    };
}

export { HashMap };
