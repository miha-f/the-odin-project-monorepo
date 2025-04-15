const Node = (value, left = null, right = null) => {
    return { value, left, right };
};

const Tree = () => {
    let _root = null;

    const buildTree = (arr) => {
        _root = null;

        let array = arr.sort((a, b) => a - b).filter((item, pos, self) => {
            return !pos || item != self[pos - 1];
        });

        // NOTE(miha): Create insert order for given arr. We then iterate over
        // insertOrder to insert nodes into the tree.
        let insertOrder = [];
        let queue = [array];
        while (queue.length) {
            let newQueue = [];
            for (let a of queue) {
                if (!a.length)
                    continue;

                const mid = Math.floor(a.length / 2);
                insertOrder.push(a[mid]);
                newQueue.push(a.slice(0, mid));
                newQueue.push(a.slice(mid + 1));
            }
            queue = newQueue;
        }

        for (const val of insertOrder)
            insert(val);

        return _root;
    };

    const insert = (value) => {
        if (_root === null) {
            _root = Node(value);
        } else {
            let node = _root;
            let parent = null;
            while (node) {
                parent = node;
                if (value > node.value)
                    node = node.right;
                else
                    node = node.left;
            }

            if (value > parent.value)
                parent.right = Node(value);
            else
                parent.left = Node(value);
        }
    }

    const deleteItem = (value) => {
        if (_root === null)
            return;

        let node = _root;
        let parent = null;
        while (node) {
            if (value == node.value)
                break;

            parent = node;

            if (value > node.value)
                node = node.right;
            else
                node = node.left;
        }

        if (parent === null) {
            let changeNode = node.right;
            while (changeNode.left)
                changeNode = changeNode.left;

            deleteItem(changeNode.value);
            node.value = changeNode.value;
            return;
        }

        if (parent.left && value == parent.left.value) {
            if (!node.left && !node.right)
                parent.left = null;
            if (node.left && !node.right)
                parent.left = node.left;
            if (!node.left && node.right)
                parent.left = node.right;
            if (node.left && node.right) {
                let changeNode = node.right;
                while (changeNode.left)
                    changeNode = changeNode.left;

                deleteItem(changeNode.value);
                node.value = changeNode.value;
            }
            return;
        }
        if (parent.right && value == parent.right.value) {
            if (!node.left && !node.right)
                parent.right = null;

            if (!node.left && !node.right)
                parent.right = null;
            if (node.left && !node.right)
                parent.right = node.left;
            if (!node.left && node.right)
                parent.right = node.right;
            if (node.left && node.right) {
                let changeNode = node.left;
                while (changeNode.right)
                    changeNode = changeNode.right;

                deleteItem(changeNode.value);
                node.value = changeNode.value;
            }
            return;
        }
    }

    const find = (value) => {
        let node = _root;
        let parent = null;
        while (node) {
            if (value == node.value)
                break;

            parent = node;

            if (value > node.value)
                node = node.right;
            else
                node = node.left;
        }
        return node;
    }

    const levelOrder = (callback) => {
        if (callback === undefined)
            throw Error("no callback error");

        if (!_root)
            return;

        let queue = [_root];
        while (queue.length) {
            let newQueue = [];
            for (let node of queue) {
                callback(node);
                if (node.left)
                    newQueue.push(node.left);
                if (node.right)
                    newQueue.push(node.right);
            }
            queue = newQueue;
        }
    }

    const inOrder = (callback) => {
        if (callback === undefined)
            throw Error("no callback error");

        if (!_root)
            return;

        let stack = [];
        let node = _root;
        while (node || stack.length) {
            while (node !== null) {
                stack.push(node)
                node = node.left;
            }
            node = stack.pop();
            callback(node);
            node = node.right;
        }
    }

    const preOrder = (callback) => {
        if (callback === undefined)
            throw Error("no callback error");

        if (!_root)
            return;

        let stack = [_root];

        while (stack.length > 0) {
            let node = stack.pop();
            callback(node);

            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
        }
    }

    const postOrder = (callback) => {
        if (callback === undefined)
            throw Error("no callback error");

        if (!_root)
            return;

        let stack1 = [_root];
        let stack2 = [];

        while (stack1.length > 0) {
            let node = stack1.pop();
            stack2.push(node);
            if (node.left) stack1.push(node.left);
            if (node.right) stack1.push(node.right);
        }

        while (stack2.length > 0) {
            callback(stack2.pop());
        }
    }

    const height = (node) => {
        if (!node) return -1;

        let queue = [node];
        let height = -1;

        while (queue.length > 0) {
            let size = queue.length;
            height++;

            for (let i = 0; i < size; i++) {
                let node = queue.shift();
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
        }

        return height;
    }

    const depth = (node) => {
        if (!_root) return -1;

        let depth = 0;
        let current = _root;

        while (current !== null) {
            if (current.value === node.value) return depth;

            depth++;
            current = node.value < current.value ? current.left : current.right;
        }

        return -1;
    }

    const isBalanced = () => {
        if (!_root) return true;

        let nodeToHeight = new Map();
        let stack = [_root];

        while (stack.length > 0) {
            let node = stack[stack.length - 1];

            if (
                (!node.left || nodeToHeight.has(node.left)) &&
                (!node.right || nodeToHeight.has(node.right))
            ) {
                let leftHeight = node.left ? nodeToHeight.get(node.left) : -1;
                let rightHeight = node.right ? nodeToHeight.get(node.right) : -1;

                if (Math.abs(leftHeight - rightHeight) > 1) return false;

                nodeToHeight.set(node, Math.max(leftHeight, rightHeight) + 1);
                stack.pop();
            } else {
                if (node.right) stack.push(node.right);
                if (node.left) stack.push(node.left);
            }
        }

        return true;
    }

    const rebalance = () => {
        let arr = [];
        inOrder((node) => { arr.push(node.value) })
        _root = buildTree(arr);
        return _root;
    }

    return {
        buildTree, insert, deleteItem, find, levelOrder, inOrder, preOrder,
        postOrder, height, depth, isBalanced, rebalance,
    };
};

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};


export { Node, Tree, prettyPrint };
