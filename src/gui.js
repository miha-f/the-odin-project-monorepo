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
                link.addEventListener("click", (e) => {
                    const projectClicked = e.target.textContent;
                    projects.setCurrentProject(projectClicked);
                    contentGui.draw();
                });
                sidebar.appendChild(link);
            })();
        }
    };

    return { draw };
})();

const contentGui = (function() {
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
        priorityEl.classList.add("todo-priority", `priority-${todo.getPriorityString()}`);
        priorityEl.textContent = `Priority: ${todo.getPriorityString()}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
            // TODO(miha): Change todo state
            todoDiv.classList.toggle("todo-completed", checkbox.checked);
        });

        const button = document.createElement("button");
        button.classList.add("remove-button");
        button.type = "button";
        button.textContent = "X";
        button.addEventListener("change", () => {
            // TODO(miha): Remove todo
        });

        // Append elements to the todo div
        infoDiv.appendChild(checkbox);
        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(projectEl);
        infoDiv.appendChild(dueDateEl);
        infoDiv.appendChild(priorityEl);
        infoDiv.appendChild(button);

        descriptionDiv.appendChild(descEl);

        todoDiv.appendChild(infoDiv);
        todoDiv.appendChild(descriptionDiv);

        return todoDiv;
    };

    const draw = () => {
        const content = document.querySelector(".content");
        clearChildrens(content);

        const todos = projects.getTodos(projects.getCurrentProject() || "default");

        todos.forEach((todo) => {
            (function() {
                const todoDiv = drawTodo(todo);
                content.appendChild(todoDiv);
            })();
        });

        (function() {
            const button = document.createElement("button");
            button.textContent = "New todo";
            // TODO(miha): Add eventlistener
            content.appendChild(button);
        })();

        // TODO: need to have: Today todos, in the week todos, in the future todos
        // todos in the past.


    };


    return { draw };
})();

export { sidebarGui, contentGui };
