
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
    gridSize = Math.max(1, Math.min(e.target.valueAsNumber, 100));
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
const RAINBOW_INDEX = colors.length;
const SHADOW_INDEX = RAINBOW_INDEX + 1;
let gridSize = 10;
let colorIndex = 0;
let shadowLevel = 1;

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

    const addEventListener = (button) => {
        button.addEventListener("click", (e) => {
            // NOTE(miha): Check if we can get index from id, otherwise rainbow
            // or shadow button was pressed.
            const getIndex = () => {
                let index = parseInt(e.target.id.replace("colorButton", ""));
                const isRainbow = e.target.className.includes("rainbow");
                const isShadow = e.target.className.includes("moon");
                if (isRainbow) index = RAINBOW_INDEX;
                if (isShadow) index = SHADOW_INDEX;
                return index;
            };

            const index = getIndex();
            colorIndex = index;
        });
    };

    for (let [index, color] of colors.entries()) {
        const button = createButton(index, color);
        addEventListener(button);
        colorsDiv.appendChild(button);
    }

    const rainbowButton = createButtonWithIcon(RAINBOW_INDEX, "fa-rainbow");
    addEventListener(rainbowButton);
    colorsDiv.appendChild(rainbowButton);

    const shadowButton = createButtonWithIcon(SHADOW_INDEX, "fa-moon");
    addEventListener(shadowButton);
    colorsDiv.appendChild(shadowButton);
};

const createGridElement = (row, column, size) => {
    const index = row * gridSize + column;
    const div = document.createElement("div");
    div.id = `gridElement${index}`;
    div.classList.add("grid-element");
    div.style["width"] = `${size}px`;
    div.style["height"] = `${size}px`;
    return div;
};

const gridElementEvent = (e) => {
    console.log(e.target.id);
    const element = document.querySelector(`#${e.target.id}`);
    // NOTE(miha): Reset opacity
    element.style["opacity"] = "1.0";

    if (colorIndex < colors.length) {
        element.style["background-color"] = colors[colorIndex];
    }
    else if (colorIndex === RAINBOW_INDEX) {
        const choice = Math.floor(Math.random() * colors.length);
        element.style["background-color"] = colors[choice];
    }
    else if (colorIndex === SHADOW_INDEX) {
        if (shadowLevel < 0)
            shadowLevel = 1;
        shadowLevel -= 0.1;
        element.style["opacity"] = `${shadowLevel}`;
    }
};

const createGrid = (gridSize) => {
    const container = document.querySelector(".container");
    container.style["width"] = `${SIZE}px`;
    const size = SIZE / gridSize;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const element = createGridElement(r, c, size);
            element.addEventListener("mouseenter", gridElementEvent);
            container.appendChild(element);
        }
    }
};

const removeGrid = () => {
    const container = document.querySelector(".container");
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
};

const createEtchSketch = (size) => {
    gridSize = size;
    console.log(gridSize);
    createColorButtons();
    createGrid(gridSize);
};

createEtchSketch(parseInt(gridSizeInput.value));
