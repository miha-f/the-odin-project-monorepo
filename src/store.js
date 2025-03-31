
const localStore = (function() {
})();

const memoryStore = (function() {
    const todos = [];
    const projects = new Map();

    const addTodo = (todo) => {
        todos.push(todo);
        projects.set(todo.project, todo.id);
    };

    const getTodos = () => todos;
    const getProjects = () => projects;

    return { addTodo, getTodos, getProjects };
})();


export { memoryStore, localStore };
