
// TODO(miha):
//          - create function that craetes div
//          - ask user input for grid size
//          - add on hover event listener
//          - add colors
//          - add rainbow effect (random color)
//          - add shadowing effect (we shadow current color by 10%)
//          - 
//          - 

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

let gridSize = 10;

// NOTE(miha): Populate "colors" div with our colors as buttons. Adds random
// color and shadow color buttons.
const createColors = () => {
    const colorsDiv = document.querySelector(".colors");

    const createButton = (index, color) => {
        const button = document.createElement("button");
        button.id = `colorButton${index}`;
        button.style["width"] = "100px";
        button.style["height"] = "100px";
        button.style["background-color"] = color;
        return button;
    };

    for (let [index, color] of colors.entries()) {
        const button = createButton(index, color);
        colorsDiv.appendChild(button);
    }

    // TODO(miha): Need better way to deal with ids

    const randomColorButton = document.createElement("button");
    randomColorButton.id = `colorButton${10}`;
    colorsDiv.appendChild(randomColorButton);

    const shadowColorButton = document.createElement("button");
    shadowColorButton.id = `colorButton${11}`;
    colorsDiv.appendChild(shadowColorButton);
};

const createGridElement = (r, c) => {
    const index = r * 10 + c;
    const div = document.createElement("div");
    div.id = `gridElement${index}`;
    div.classList.add("grid-element");
    return div;
};

const createGrid = () => {
    const container = document.querySelector(".container");

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const element = createGridElement(r, c);
            container.appendChild(element);
        }
    }
};

const createEtchSketch = () => {
    createColors();
    createGrid();
    // get user width
    // set container widht
    // calc gridElement w and h
    // creade grid with gridElement w and h
};

createEtchSketch();
