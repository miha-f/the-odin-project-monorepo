import { HashMap } from "./hash_map.js";
import { HashSet } from "./set.js";

const test = HashMap();

test.set('apple', 'red')
test.set('apple', 'blue')
test.set('banana', 'yellow')
test.set('carrot', 'orange')
test.set('dog', 'brown')
test.set('elephant', 'gray')
test.set('frog', 'green')
test.set('grape', 'purple')
test.set('hat', 'black')
test.set('ice cream', 'white')
test.set('jacket', 'blue')
test.set('kite', 'pink')
test.set('lion', 'golden')
// NOTE(miha): This causes hash map to grow
test.set('moon', 'silver')

console.log(test.has("moon"));
console.log(test.has("sun"));
console.log(test.get("moon"));
console.log(test.get("sun"));
console.log(test.remove("moon"));
console.log(test.remove("moon"));
console.log(test.get("moon"));

console.log(test.keys());
console.log(test.values());
console.log(test.entries());
console.log(test.length());

console.log(test.clear());
console.log(test.keys());
console.log(test.values());
console.log(test.entries());
console.log(test.length());

console.log("testing shapes");

const shapes = HashSet();
shapes.set("triangle");
shapes.set("triangle");
shapes.set("triangle");
shapes.set("square");
shapes.set("circle");
shapes.set("polygon");
shapes.set("hexagon");
shapes.remove("triangle");
console.log(shapes.keys());
console.log(shapes.values());
console.log(shapes.entries());
console.log(shapes.length());
