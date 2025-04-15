import { HashMap } from "./hash_map.js";

const HashSet = (capacity = 16, loadFactor = 0.75) => {
    const hashMap = HashMap(capacity, loadFactor);

    const set = (key) => {
        hashMap.set(key, true);
    }

    return {
        ...hashMap,
        set,
    }
}

export { HashSet };
