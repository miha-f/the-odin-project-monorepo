const draw = () => {
    const content = document.querySelector("#content");

    const header = document.createElement("h1");
    header.textContent = "About";

    const paragraph = document.createElement("p");
    paragraph.textContent = "This is our story:";

    content.appendChild(header);
    content.appendChild(paragraph);
};

export default draw;
