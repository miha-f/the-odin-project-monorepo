import { projects } from "./projects.js";

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

        for (let [projectName, _] of projects.getProjects()) {
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
    const drawTodo = () => { };

    const draw = () => {
        const content = document.querySelector(".content");
        clearChildrens(content);

        // TODO(miha): Need something to manage state and get current clicked project.
        const todos = projects.getTodos("default");

        todos.forEach((todo) => {
            (function() {
                const h1 = document.createElement("h1");
                h1.textContent = `${todo.getTitle()}`;
                content.appendChild(h1);
            })();
        });


    };


    return { draw };
})();

export { sidebarGui, contentGui };
