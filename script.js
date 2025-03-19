
// TODO(miha):
//          - create function that craetes div
//          - ask user input for grid size
//          - add on hover event listener
//          - add colors
//          - add rainbow effect (random color)
//          - add shadowing effect (we shadow current color by 10%)
//          - 
//          - 

const gridSizeInput = document.querySelector("#gridSizeInput");

gridSizeInput.addEventListener("change", (e) => {
    removeGrid();
    const gridSize = Math.max(1, Math.min(e.target.valueAsNumber, 100));
    createGrid(gridSize);
});

// NOTE(miha): ChatGPT generated.
const colors = [
    "#FF6B6B", // Soft Red
    "#6BFFB3", // Mint Green
    "#6B9EFF", // Soft Blue
    "#FFC75F", // Warm Yellow
    "#845EC2", // Deep Purple
    "#D65DB1", // Vibrant Pink
    "#FF9671", // Peach
    "#4ECDC4", // Turquoise
    "#FF6347", // Tomato Red
    "#FFD700"  // Gold
];

const SIZE = 800;
let gridSize = 10;

// NOTE(miha): Populate "colors" div with our colors as buttons. Adds random
// color and shadow color buttons.
const createColorButtons = () => {
    const colorsDiv = document.querySelector(".colors");

    const createButton = (index, color) => {
        const button = document.createElement("button");
        button.id = `colorButton${index}`;
        button.style["width"] = "50px";
        button.style["height"] = "50px";
        button.style["background-color"] = color;
        return button;
    };

    const createButtonWithIcon = (index, iconString) => {
        button = createButton(index, "transparent");
        iconElement = document.createElement("i");
        iconElement.classList.add("fa-solid", iconString);
        button.style["font-size"] = "35px";
        button.appendChild(iconElement);
        return button
    };

    for (let [index, color] of colors.entries()) {
        const button = createButton(index, color);
        colorsDiv.appendChild(button);
    }

    const rainbowButton = createButtonWithIcon(10, "fa-rainbow");
    colorsDiv.appendChild(rainbowButton);

    const shadowButton = createButtonWithIcon(11, "fa-moon");
    colorsDiv.appendChild(shadowButton);
};

const createGridElement = (row, column, size) => {
    const index = row * 10 + column;
    const div = document.createElement("div");
    div.id = `gridElement${index}`;
    div.classList.add("grid-element");
    div.style["width"] = `${size}px`;
    div.style["height"] = `${size}px`;
    return div;
};

const createGrid = (gridSize) => {
    const container = document.querySelector(".container");
    container.style["width"] = `${SIZE}px`;
    const size = SIZE / gridSize;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const element = createGridElement(r, c, size);
            container.appendChild(element);
            // TODO(miha): Add eventlistener
        }
    }
};

const removeGrid = () => {
    const container = document.querySelector(".container");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
};

const createEtchSketch = (gridSize) => {
    createColorButtons();
    createGrid(gridSize);
};

createEtchSketch(parseInt(gridSizeInput.value));
