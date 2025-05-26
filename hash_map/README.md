
# Hash map

Goal: Implement hash map and set data structure in JS.

Tech: JS

[Live preview](https://miha-f.github.io/the-odin-project-monorepo/hash_map/)

## Run project
```bash
node index.js
```

or open `index.html` in browser and check developer console for output.

## Output
```bash
miha@mihas-Air hash_map % node index.js
map.entries:  [
  [ 'elephant', 'gray' ],
  [ 'moon', 'silver' ],
  [ 'carrot', 'orange' ],
  [ 'frog', 'green' ],
  [ 'banana', 'yellow' ],
  [ 'apple', 'blue' ],
  [ 'grape', 'purple' ],
  [ 'hat', 'black' ],
  [ 'dog', 'brown' ],
  [ 'lion', 'golden' ],
  [ 'ice cream', 'white' ],
  [ 'jacket', 'blue' ],
  [ 'kite', 'pink' ]
]
map.has('moon'):  true
map.has('sun'):  false
map.get('moon'):  silver
map.get('sun'):  null
map.remove('moon'):  true
map.remove('moon'):  false
map.get('moon'):  null
map.keys:  [
  'elephant', 'carrot',
  'frog',     'banana',
  'apple',    'grape',
  'hat',      'dog',
  'lion',     'ice cream',
  'jacket',   'kite'
]
map.values:  [
  'gray',   'orange',
  'green',  'yellow',
  'blue',   'purple',
  'black',  'brown',
  'golden', 'white',
  'blue',   'pink'
]
map.entries:  [
  [ 'elephant', 'gray' ],
  [ 'carrot', 'orange' ],
  [ 'frog', 'green' ],
  [ 'banana', 'yellow' ],
  [ 'apple', 'blue' ],
  [ 'grape', 'purple' ],
  [ 'hat', 'black' ],
  [ 'dog', 'brown' ],
  [ 'lion', 'golden' ],
  [ 'ice cream', 'white' ],
  [ 'jacket', 'blue' ],
  [ 'kite', 'pink' ]
]
map.length:  12
undefined
[]
[]
[]
0
map.clear()
map.keys:  []
map.values:  []
map.entries:  []
map.length:  0
testing shapes (set)
shapes.keys():  [ 'circle', 'hexagon', 'polygon', 'square' ]
shapes.values():  [ true, true, true, true ]
shapes.entries():  [
  [ 'circle', true ],
  [ 'hexagon', true ],
  [ 'polygon', true ],
  [ 'square', true ]
]
shapes.length():  4
```
