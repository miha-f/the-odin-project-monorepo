import { localStore } from "./store";

const projects = (function() {
    // NOTE(miha): key: project name, value: array of todos
    let projects = new Map();

    // NOTE(miha): key: todo id, value: project name
    let todos = new Map();

    globalThis.projects = projects;
    globalThis.todos = todos;

    let currentProject = undefined;

    const addTodo = (todo) => {
        const projectName = todo.getProject();
        if (!projects.has(projectName))
            projects.set(projectName, []);
        projects.get(projectName).push(todo);
        currentProject = projectName;
        todos.set(todo.getId(), projectName);

        localStore.update(projects, todos);
    };
    const removeTodo = (id) => {
        const projectName = todos.get(id);
        if (!projects.has(projectName))
            return;

        const index = projects.get(projectName).findIndex((obj) => obj.getId() === id);
        projects.get(projectName).splice(index, 1);

        todos.delete(id);

        localStore.update(projects, todos);
    };

    const toggleTodoDone = (id) => {
        const projectName = todos.get(id);
        if (!projects.has(projectName))
            return;

        const index = projects.get(projectName).findIndex((obj) => obj.getId() === id);
        const currDone = projects.get(projectName)[index].getDone();
        projects.get(projectName)[index].setDone(!currDone);
    }

    const set = (p, t) => {
        projects = p;
        todos = t;
    };
    const get = () => projects;
    const getNames = () => projects.keys();
    const getTodos = (projectName) => projects.get(projectName);

    const getCurrentProject = () => currentProject;
    const setCurrentProject = (project) => currentProject = project;

    return {
        addTodo, removeTodo, set, get, getNames, getTodos, getCurrentProject,
        setCurrentProject, toggleTodoDone
    };
})();

export { projects };
