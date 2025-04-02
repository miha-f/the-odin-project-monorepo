import { Tree, prettyPrint } from "./tree.js";

const tree = Tree();

const root = tree.buildTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
prettyPrint(root);

