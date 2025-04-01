
// TODO(miha): This file should only be used for storing stuff to local storage

import { createTodo } from "./todo";

const localStore = (function() {

    // NOTE(miha): Save all projects to local store.
    const update = (projects, todos) => {
        console.log("updating local storage");
        const projectsJson = JSON.stringify([...projects]);
        localStorage.projects = projectsJson;

        const todosJson = JSON.stringify([...todos]);
        localStorage.todos = todosJson;
    };

    // NOTE(miha): Get all projects with todos from local store.
    const get = () => {
        const storedProjects = new Map(JSON.parse(localStorage.getItem("projects")));
        const projects = new Map();
        storedProjects.forEach((value, key, _) => {
            const todos = [];
            value.forEach((todo) => {
                todos.push(createTodo(
                    todo.title,
                    todo.description,
                    todo.project,
                    todo.priority,
                    new Date(todo.dueDate),
                    todo.done,
                    todo.id,
                ));
            });
            projects.set(key, todos);
        });

        const storedTodos = JSON.parse(localStorage.getItem("todos"));
        const todos = new Map(storedTodos);

        return {
            p: projects,
            t: todos,
        }
    };

    return { update, get };
})();


export { localStore };
