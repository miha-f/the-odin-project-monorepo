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
console.log("list at the start: ", list.toString());
console.log("tail: ", list.tail());
console.log("list[0]: ", list.at(0));
console.log("list[1]: ", list.at(1));
console.log("list[4]: ", list.at(4));
list.pop();
console.log("pop");
console.log("list.contains('corgi'): ", list.contains("corgi"));
console.log("list.contains('turtle'): ", list.contains("turtle"));
console.log("list.contains('snake'): ", list.contains("snake"));
console.log("list.find('corgi'): ", list.find("corgi"));
console.log("list.find('turtle'): ", list.find("turtle"));
console.log("list.find('snake'): ", list.find("snake"));
console.log("insertAt('cat', 1)");
list.insertAt("cat", 1);
console.log("removeAt(4)");
list.removeAt(4);

console.log("list at the end: ", list.toString());
