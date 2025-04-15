import "./style.css";

import drawHome from "./pages/home.js";
import drawMenu from "./pages/menu.js";
import drawAbout from "./pages/about.js";

const tabs = (function() {
    const init = (...tabMappings) => {
        if (tabMappings.length === 0)
            throw Error("please provide some tab mappings");

        for (const { button, func } of tabMappings) {
            button.addEventListener('click', (e) => {
                clear();
                func();
            });
        }

        tabMappings[0].func();
    };

    const clear = () => {
        const content = document.querySelector("#content");
        while (content.firstChild)
            content.removeChild(content.lastChild);
    };

    return { init, clear };
})();

const createTabMap = (button, func) => {
    return { button, func };
}

const homeButton = document.querySelector("#home");
const menuButton = document.querySelector("#menu");
const aboutButton = document.querySelector("#about");

tabs.init(
    createTabMap(homeButton, drawHome),
    createTabMap(menuButton, drawMenu),
    createTabMap(aboutButton, drawAbout),
);
