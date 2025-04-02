import { LinkedList } from "./linked_list.js";

const list = LinkedList();

list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.prepend("corgi");
list.append("turtle");
list.prepend("corgi");
console.log(list.tail());

console.log(list.toString());
