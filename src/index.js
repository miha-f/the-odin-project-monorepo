import "./style.css";

// modules:
//   todo
//   projects
//   local storage
//   gui

import { sidebarGui, contentGui } from "./gui.js";
import { projects } from "./projects.js";
import { createTodo } from "./todo.js";

projects.addTodo(createTodo("title 1", "description dfasfasd fasdf asd fasd fasdfasdfasdf asd fasdfa dsfdsf asdf asf dasf sda fasd fasd"));
projects.addTodo(createTodo("title 2", "description", "default", 2));
projects.addTodo(createTodo("title 3", "description", "work"));
projects.addTodo(createTodo("title 4 is longer and ollo fadsf asd adsf", "description", "default", 1));

sidebarGui.draw();
contentGui.draw();
