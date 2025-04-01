import { projects } from "./projects.js";
import { createTodo, getPriorityFromString } from "./todo.js";

const clearChildrens = (element) => {
    while (element.firstChild)
        element.removeChild(element.lastChild);
};

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
        checkbox.addEventListener("click", () => {
            // TODO(miha): Change todo state
            todoDiv.classList.toggle("todo-completed", checkbox.checked);
        });

        const button = document.createElement("button");
        button.classList.add("remove-button");
        button.type = "button";
        button.textContent = "X";
        button.addEventListener("click", () => {
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

    const drawTodoForm = () => {
        const content = document.querySelector(".content");

        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo-item");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("item-info");

        const descriptionDiv = document.createElement("div");

        // Create elements
        const titleEl = document.createElement("input");
        titleEl.style["width"] = "200px";
        titleEl.type = "input";
        titleEl.placeholder = "Title";
        titleEl.setAttribute("required", "");

        const descEl = document.createElement("textarea");
        descEl.placeholder = "desc";
        descEl.setAttribute("required", "");

        const projectEl = document.createElement("input");
        projectEl.type = "input";
        projectEl.placeholder = `Project:`;
        projectEl.setAttribute("required", "");

        const dueDateEl = document.createElement("input");
        dueDateEl.type = "date";
        dueDateEl.setAttribute("required", "");

        const priorityEl = document.createElement("select");
        priorityEl.classList.add("priority-low");
        const optionLow = document.createElement("option");
        optionLow.textContent = "Low priority";
        optionLow.value = "low";
        const optionMid = document.createElement("option");
        optionMid.textContent = "Mid priority";
        optionMid.value = "mid";
        const optionHigh = document.createElement("option");
        optionHigh.textContent = "High priority";
        optionHigh.value = "high";
        priorityEl.appendChild(optionLow);
        priorityEl.appendChild(optionMid);
        priorityEl.appendChild(optionHigh);
        // NOTE(miha): Change background color based on option selected.
        priorityEl.addEventListener("click", (e) => {
            const priorityEl = document.querySelector(".item-info select");
            const priority = e.target.value;
            priorityEl.className = "";
            priorityEl.classList.add(`priority-${priority}`);
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("click", () => {
            todoDiv.classList.toggle("todo-completed", checkbox.checked);
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.type = "button";
        removeButton.textContent = "X";
        // NOTE(miha): Remove todo form
        removeButton.addEventListener("click", (e) => {
            e.target.parentNode.parentNode.remove();
        });

        const createButton = document.createElement("button");
        createButton.type = "button";
        createButton.textContent = "Create TODO";
        createButton.addEventListener("click", (e) => {
            const titleValid = titleEl.checkValidity();
            const projectValid = projectEl.checkValidity();
            const dateValid = dueDateEl.checkValidity();
            const descriptionValid = descEl.checkValidity();
            const isValid = titleValid && projectValid && dateValid && descriptionValid;

            if (isValid) {
                const done = checkbox.checked;
                const title = titleEl.value;
                const project = projectEl.value;
                const date = dueDateEl.valueAsDate;
                const priority = priorityEl.value;
                const description = descEl.value;

                projects.addTodo(createTodo(
                    title,
                    description,
                    project,
                    getPriorityFromString(priority),
                    date,
                    done
                ));

                e.target.parentNode.remove();
                console.log(projects.getTodos());
                sidebarGui.draw();
                draw();
            }
        });

        // Append elements to the todo div
        infoDiv.appendChild(checkbox);
        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(projectEl);
        infoDiv.appendChild(dueDateEl);
        infoDiv.appendChild(priorityEl);
        infoDiv.appendChild(removeButton);

        // descriptionDiv.appendChild(descEl);

        todoDiv.appendChild(infoDiv);
        todoDiv.appendChild(descEl);
        todoDiv.appendChild(createButton);

        content.insertBefore(todoDiv, content.lastChild);

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
            button.addEventListener("click", () => {
                drawTodoForm();
            });
            content.appendChild(button);
        })();

        // TODO: need to have: Today todos, in the week todos, in the future todos
        // todos in the past.


    };


    return { draw };
})();

export { sidebarGui, contentGui };
