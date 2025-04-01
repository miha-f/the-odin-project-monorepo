
const projects = (function() {
    // NOTE(miha): key: project name, value: array of todos
    const projects = new Map();

    let currentProject = undefined;

    const addTodo = (todo) => {
        const projectName = todo.getProject();
        if (!projects.has(projectName))
            projects.set(projectName, []);
        projects.get(projectName).push(todo);
        currentProject = projectName;
        // TODO(miha): Update store
    };
    const removeTodo = (projectName, id) => {
        if (!projects.has(projectName))
            return;

        const todos = projects.get(projectName);
        const index = todos.findIndex((obj) => obj.id === id);
        todos.splice(index, 1);
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
