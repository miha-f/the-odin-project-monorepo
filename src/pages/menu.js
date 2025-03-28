const draw = () => {
    const content = document.querySelector("#content");

    const header = document.createElement("h1");
    header.textContent = "Menu";

    const paragraph = document.createElement("p");
    paragraph.textContent = "We offer the best ice cream!";

    content.appendChild(header);
    content.appendChild(paragraph);
};

export default draw;
