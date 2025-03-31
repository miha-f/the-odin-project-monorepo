import { memoryStore } from "./store.js";

const clearChildrens = (element) => {
    while (element.firstChild)
        element.removeChild(element.lastChild);
};

const todoGui = (function() {
    const createTodo = () => {

    };

    return { createTodo };
})();

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

        for (let [projectName, _] of memoryStore.getProjects()) {
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

export { todoGui, sidebarGui };
