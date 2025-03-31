

const TODO_PRIORITY_LOW = 0;
const TODO_PRIORITY_MID = 1;
const TODO_PRIORITY_HIGH = 2;


const createTodo = (title, description, project = "default", dueDate = new Date(), priority = TODO_PRIORITY_LOW, done = false) => {
    let _title = title;
    const getTitle = () => _title;
    const setTitle = (title) => {
        if (title === "") throw Error("title empty error");
        _title = title;
    };

    let _description = description;
    const getDescription = () => _description;
    const setDescription = (description) => {
        if (description === "") throw Error("description empty error");
        _description = description;
    };

    let _dueDate = dueDate;
    const getDate = () => _dueDate;
    const setDate = (dueDate) => _dueDate = dueDate;

    let _priority = priority;
    const getPriority = () => _priority;
    const setPriority = (priority) => {
        if (priority < TODO_PRIORITY_LOW || priority > TODO_PRIORITY_HIGH) throw Error("priority out of range error");
        _priority = priority;
    };

    let _done = done;
    const getDone = () => _done;
    const setDone = (done) => _done = done;

    const _id = crypto.randomUUID();
    const getId = () => _id;

    return { getTitle, setTitle, getDescription, setDescription, getDate, setDate, getPriority, setPriority, getDone, setDone, getId };
};


export { createTodo };
