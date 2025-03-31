
const projects = (function() {
    // NOTE(miha): key: project name, value: array of todos
    const projects = new Map();

    const addTodo = (todo) => {
        const projectName = todo.getProject();
        if (!projects.has(projectName))
            projects.set(projectName, []);
        projects.get(projectName).push(todo);
    };

    const get = () => projects;
    const getNames = () => projects.keys();
    const getTodos = (projectName) => projects.get(projectName);

    return { addTodo, get, getNames, getTodos };
})();

export { projects };
