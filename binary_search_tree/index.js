import { Tree, prettyPrint } from "./tree.js";

const tree = Tree();

let root = tree.buildTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
tree.deleteItem(8);
tree.deleteItem(23);
prettyPrint(root);
console.log("is balanced: ", tree.isBalanced());
console.log("balacing...");
root = tree.rebalance();
prettyPrint(root);
console.log("is balanced: ", tree.isBalanced());
