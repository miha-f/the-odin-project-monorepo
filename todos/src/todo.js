

const TODO_PRIORITY_LOW = 0;
const TODO_PRIORITY_MID = 1;
const TODO_PRIORITY_HIGH = 2;


const createTodo = (title, description, project = "default",
    priority = TODO_PRIORITY_LOW, dueDate = new Date(), done = false,
    id = undefined
) => {
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

    let _project = project;
    const getProject = () => _project;
    const setProject = (project) => {
        if (project === "") throw Error("project empty error");
        _project = project;
    };

    let _dueDate = dueDate;
    const getDate = () => _dueDate;
    const getFormattedDate = () => {
        const day = _dueDate.getDate().toString().padStart(2, "0");
        const month = (_dueDate.getMonth() + 1).toString().padStart(2, "0");
        const year = _dueDate.getFullYear();
        return `${day}.${month}.${year}`;
    }
    const setDate = (dueDate) => _dueDate = dueDate;

    let _priority = priority;
    const getPriority = () => _priority;
    const getPriorityString = () => {
        switch (_priority) {
            case TODO_PRIORITY_LOW: return "low";
            case TODO_PRIORITY_MID: return "mid";
            case TODO_PRIORITY_HIGH: return "high";
            default: return "low";
        }
    };
    const setPriority = (priority) => {
        if (priority < TODO_PRIORITY_LOW || priority > TODO_PRIORITY_HIGH) throw Error("priority out of range error");
        _priority = priority;
    };

    let _done = done;
    const getDone = () => _done;
    const setDone = (done) => _done = done;

    const _id = id === undefined ? crypto.randomUUID() : id;
    const getId = () => _id;

    const toJSON = function() {
        return {
            title: this.getTitle(),
            description: this.getDescription(),
            project: this.getProject(),
            dueDate: this.getDate(),
            priority: this.getPriority(),
            done: this.getDone(),
            id: this.getId(),
        };
    }

    return {
        getTitle, setTitle, getDescription, setDescription,
        getProject, setProject, getDate, getFormattedDate, setDate,
        getPriority, getPriorityString, setPriority, getDone, setDone, getId,
        toJSON
    };
};

const getPriorityFromString = (priorityString) => {
    switch (priorityString) {
        case "low":
        case "LOW": return TODO_PRIORITY_LOW;
        case "mid":
        case "MID": return TODO_PRIORITY_MID;
        case "high":
        case "HIGH": return TODO_PRIORITY_HIGH;
        default: return TODO_PRIORITY_LOW;
    }
};


export {
    createTodo,
    getPriorityFromString,
    TODO_PRIORITY_LOW,
    TODO_PRIORITY_MID,
    TODO_PRIORITY_HIGH,
};
