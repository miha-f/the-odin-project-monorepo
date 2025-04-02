import { HashMap } from "./hash_map.js";

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

test.set('moon', 'silver')

console.log(test.keys());
console.log(test.values());
console.log(test.entries());
