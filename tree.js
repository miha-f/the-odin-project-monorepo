const Node = (value, left = null, right = null) => {
    return { value, left, right };
};

const Tree = (arr) => {
    let root = null;

    const buildTree = (arr) => {
        // sort
        // remove duplicates
        // return root
    };

    const insert = (value) => {
    }

    const deleteItem = (value) => {
    }

    const find = (value) => {
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
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};


export { Node, Tree };
