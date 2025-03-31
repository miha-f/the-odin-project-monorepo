import "./style.css";

// modules:
//   todo
//   projects
//   local storage
//   gui

import { sidebarGui, contentGui } from "./gui.js";
import { projects } from "./projects.js";
import { createTodo } from "./todo.js";

projects.addTodo(createTodo("title 1", "description"));
projects.addTodo(createTodo("title 2", "description"));
projects.addTodo(createTodo("title 3", "description", "work"));
projects.addTodo(createTodo("title 4", "description"));

sidebarGui.draw();
contentGui.draw();
