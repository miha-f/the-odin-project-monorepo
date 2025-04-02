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
console.log(list.at(0));
console.log(list.at(1));
console.log(list.at(4));
list.pop();
console.log(list.contains("corgi"));
console.log(list.contains("turtle"));
console.log(list.contains("snake"));
console.log(list.find("corgi"));
console.log(list.find("turtle"));
console.log(list.find("snake"));

console.log(list.toString());
