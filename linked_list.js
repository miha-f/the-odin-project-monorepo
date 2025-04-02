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
        _size++;
    };

    const prepend = (value) => {
        const node = Node(value);
        node.next = _head;
        _head = node;
        _size++;
    };

    const size = () => { return _size; };

    const head = () => { return _head; };

    const tail = () => {
        let curr = _head;
        while (curr.next)
            curr = curr.next;
        return curr;
    };

    const at = (index) => {
        let i = 0;
        let curr = _head;
        while (curr.next && i < index) {
            curr = curr.next;
            i++;
        }
        return i !== index ? null : curr;
    };

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
