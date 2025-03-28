const draw = () => {
    const content = document.querySelector("#content");

    const header = document.createElement("h1");
    header.textContent = "Welcome to the best ice cream place!";

    const paragraph = document.createElement("p");
    paragraph.textContent = "Want to see what we offer? Check tab Menu. Want to know our story - check tab About.";

    content.appendChild(header);
    content.appendChild(paragraph);
};

export default draw;
