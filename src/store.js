
const localStore = (function() {
})();

const memoryStore = (function() {
    // NOTE(miha): key: project name, value: array of todos
    const projects = new Map();

    const addTodo = (todo) => {
        const projectName = todo.project;
        if (!projects.has(projectName))
            projects.set(projectName, []);
        projects.get(projectName).push(todo);
    };

    const getTodos = () => todos;
    const getProjects = () => projects;

    return { addTodo, getTodos, getProjects };
})();


export { memoryStore, localStore };
