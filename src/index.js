import "./style.css";

// modules:
//   todo
//   projects
//   local storage
//   gui

// TODO(miha): 
//      - drop down for priority
//      - sorting at top (priority, date, title, ...)
//      - new todo form
//      - local storage
//      - maybe don't add option to choose project from new todo form (for form
//        it would make sense to add new project from sidebar)

import { sidebarGui, contentGui } from "./gui.js";
import { localStore } from "./store.js";
import { projects } from "./projects.js";

// projects.addTodo(createTodo("title 1", "description dfasfasd fasdf asd fasd fasdfasdfasdf asd fasdfa dsfdsf asdf asf dasf sda fasd fasd"));
// projects.addTodo(createTodo("title 2", "description", "default", 2));
// projects.addTodo(createTodo("title 3", "description", "work"));
// projects.addTodo(createTodo("title 4 is longer and ollo fadsf asd adsf", "description", "default", 1));

const { p, t } = localStore.get();
projects.set(p, t);


sidebarGui.draw();
contentGui.draw();
