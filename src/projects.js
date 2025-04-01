
const projects = (function() {
    // NOTE(miha): key: project name, value: array of todos
    const projects = new Map();

    // NOTE(miha): key: todo id, value: project name
    const todos = new Map();

    let currentProject = undefined;

    const addTodo = (todo) => {
        const projectName = todo.getProject();
        if (!projects.has(projectName))
            projects.set(projectName, []);
        projects.get(projectName).push(todo);
        currentProject = projectName;
        todos.set(todo.getId(), projectName);
        // TODO(miha): Update store
    };
    const removeTodo = (id) => {
        const projectName = todos.get(id);
        if (!projects.has(projectName))
            return;

        const index = projects.get(projectName).findIndex((obj) => obj.id === id);
        projects.get(projectName).splice(index, 1);

        todos.delete(id);
        // TODO(miha): Update store
    };

    const get = () => projects;
    const getNames = () => projects.keys();
    const getTodos = (projectName) => projects.get(projectName);

    const getCurrentProject = () => currentProject;
    const setCurrentProject = (project) => currentProject = project;

    return {
        addTodo, removeTodo, get, getNames, getTodos, getCurrentProject,
        setCurrentProject
    };
})();

export { projects };
