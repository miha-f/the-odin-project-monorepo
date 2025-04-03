const Node = (value, left = null, right = null) => {
    return { value, left, right };
};

const Tree = () => {
    let _root = null;

    const buildTree = (arr) => {
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
    }

    const inOrder = (callback) => {
    }

    const preOrder = (callback) => {
    }

    const postOrder = (callback) => {
    }

    const height = (node) => {
    }

    const depth = (node) => {
    }

    const isBalanced = () => {
    }

    const rebalance = () => {
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
