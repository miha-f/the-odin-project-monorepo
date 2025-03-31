import "./style.css";

// modules:
//   todo
//   projects
//   local storage
//   gui

import { sidebarGui, contentGui } from "./gui.js";
import { memoryStore } from "./store.js";
import { createTodo } from "./todo.js";

memoryStore.addTodo(createTodo("title 1", "description"));
memoryStore.addTodo(createTodo("title 2", "description"));
memoryStore.addTodo(createTodo("title 3", "description", "work"));
memoryStore.addTodo(createTodo("title 4", "description"));

sidebarGui.draw();
contentGui.draw();
