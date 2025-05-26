# Linked list

Goal: Implement linked list data structure in JS.

Tech: JS

[Live preview](https://miha-f.github.io/the-odin-project-monorepo/linked_list)

## Run project
```bash
node index.js
```

or open `index.html` in browser and check developer console for output.

## Output
```bash
miha@mihas-Air linked_list % node index.js
list at the start:  ( corgi ) -> ( corgi ) -> ( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> ( null )
tail:  { value: 'turtle', next: null }
list[0]:  {
  value: 'corgi',
  next: { value: 'corgi', next: { value: 'dog', next: [Object] } }
}
list[1]:  {
  value: 'corgi',
  next: { value: 'dog', next: { value: 'cat', next: [Object] } }
}
list[4]:  {
  value: 'parrot',
  next: { value: 'hamster', next: { value: 'snake', next: [Object] } }
}
pop
list.contains('corgi'):  true
list.contains('turtle'):  false
list.contains('snake'):  true
list.find('corgi'):  0
list.find('turtle'):  null
list.find('snake'):  6
insertAt('cat', 1)
removeAt(4)
list at the end:  ( corgi ) -> ( cat ) -> ( corgi ) -> ( dog ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( null )
```
