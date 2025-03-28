const createMenuItem = (header, paragraph) => {
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");

    h2.textContent = header;
    p.textContent = paragraph;

    div.appendChild(h2);
    div.appendChild(p);
    div.classList.add("menu-item");

    return div;
};

const draw = () => {
    const content = document.querySelector("#content");

    const menu = [
        createMenuItem("🍦 Classic Vanilla", "Rich, creamy, and made with real vanilla beans."),
        createMenuItem("🍓 Strawberry Delight", "Fresh strawberries blended into a smooth, fruity treat."),
        createMenuItem("🍫 Chocolate Heaven", "Deep, decadent chocolate with a hint of cocoa crunch."),
        createMenuItem("🌿 Mint Chocolate Chip", "Refreshing mint ice cream with rich chocolate chips."),
        createMenuItem("🥭 Mango Sorbet", "A tropical dairy-free delight with real mango puree."),
    ];

    for (const item of menu)
        content.appendChild(item);
};

export default draw;
