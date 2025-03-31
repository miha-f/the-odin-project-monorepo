import { projects } from "./projects.js";
import { TODO_PRIORITY_LOW, TODO_PRIORITY_MID, TODO_PRIORITY_HIGH } from "./todo.js";

const clearChildrens = (element) => {
    while (element.firstChild)
        element.removeChild(element.lastChild);
};

// TODO(miha): Add insert todo form

const sidebarGui = (function() {

    const draw = () => {
        const sidebar = document.querySelector(".sidebar");
        clearChildrens(sidebar);

        // NOTE(miha): Add h1 element.
        (function() {
            const h1 = document.createElement("h1");
            h1.textContent = "Projects";
            sidebar.appendChild(h1);
        })();

        for (let projectName of projects.getNames()) {
            // NOTE(miha): Add project names to the sidebar.
            (function() {
                const link = document.createElement("a");
                link.textContent = `${projectName}`;
                link.setAttribute("href", "#");

                // TODO(miha): Add eventListener so we can switch between projects.

                sidebar.appendChild(link);
            })();
        }
    };

    return { draw };
})();

const contentGui = (function() {
    const getTodoPriorityClass = (priority) => {
        switch (priority) {
            case TODO_PRIORITY_LOW: return "priority-low";
            case TODO_PRIORITY_MID: return "priority-mid";
            case TODO_PRIORITY_HIGH: return "priority-high";
            default: return "priority-low";
        }
    }

    const drawTodo = (todo) => {
        // Create main todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("item-info");

        const descriptionDiv = document.createElement("div");


        // Create elements
        const titleEl = document.createElement("h3");
        titleEl.textContent = todo.getTitle();

        const descEl = document.createElement("p");
        descEl.textContent = todo.getDescription();

        const projectEl = document.createElement("span");
        projectEl.textContent = `Project: ${todo.getProject()}`;

        const dueDateEl = document.createElement("span");
        dueDateEl.textContent = `Due: ${todo.getFormattedDate()}`;

        const priorityEl = document.createElement("span");
        priorityEl.classList.add("todo-priority", getTodoPriorityClass(todo.getPriority()));
        priorityEl.textContent = `Priority: ${todo.getPriorityString()}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            todoDiv.classList.toggle("completed", checkbox.checked);
        });

        // Append elements to the todo div
        infoDiv.appendChild(checkbox);
        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(projectEl);
        infoDiv.appendChild(dueDateEl);
        infoDiv.appendChild(priorityEl);

        descriptionDiv.appendChild(descEl);

        todoDiv.appendChild(infoDiv);
        todoDiv.appendChild(descriptionDiv);

        return todoDiv;
    };

    const draw = () => {
        const content = document.querySelector(".content");
        clearChildrens(content);

        // TODO(miha): Need something to manage state and get current clicked project.
        const todos = projects.getTodos("default");

        todos.forEach((todo) => {
            (function() {
                const todoDiv = drawTodo(todo);
                content.appendChild(todoDiv);
            })();
        });


    };


    return { draw };
})();

export { sidebarGui, contentGui };
