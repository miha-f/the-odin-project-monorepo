
// TODO(miha):
//          - create function that craetes div
//          - ask user input for grid size
//          - add on hover event listener
//          - add colors
//          - add rainbow effect (random color)
//          - add shadowing effect (we shadow current color by 10%)
//          - 
//          - 

let gridSize = 10;

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

createGrid();
