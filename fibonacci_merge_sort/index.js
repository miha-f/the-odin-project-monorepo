import { fibs, fibsRec } from "./fibonacci.js";
import { mergeSort } from "./merge_sort.js";

console.log(fibs(8));
console.log(fibsRec(8));

const arr1 = [3, 2, 1, 13, 8, 5, 0, 1];
console.log(mergeSort(arr1, 0, arr1.length));

const arr2 = [79, 100, 105, 110];
console.log(mergeSort(arr2, 0, arr2.length));
