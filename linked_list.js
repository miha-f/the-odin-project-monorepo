const LinkedList = () => {
    let _head = null;
    let _size = 0;

    const append = (value) => {
        const node = Node(value);
        if (_head === null) {
            _head = node
        }
        else {
            let curr = _head;
            while (curr.next)
                curr = curr.next;
            curr.next = node;
        }
    };

    const prepend = (value) => { };

    const size = () => { return _size; };
    const head = () => { return _head; };
    const tail = () => { };
    const at = (index) => { };
    const pop = () => { };
    const contains = (value) => { };
    const find = (value) => { };

    const toString = () => {
        let curr = _head;
        let result = "";
        while (curr) {
            result += `( ${curr.value} ) -> `;
            curr = curr.next;
        }
        result += `( ${null} )`;
        return result;
    };

    const insertAt = (value, index) => { };
    const removeAt = (index) => { };

    return {
        append, prepend, size, head, tail, at, pop, contains, find,
        toString, insertAt, removeAt
    };
}

const Node = (valueParam = null, nextParam = null) => {
    const value = valueParam;
    const next = nextParam;
    return { value, next };
}

export { LinkedList };
