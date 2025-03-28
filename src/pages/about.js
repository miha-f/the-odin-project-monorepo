const createListItem = (text) => {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    return listItem
};

const draw = () => {
    const content = document.querySelector("#content");

    const storyHeader = document.createElement("h1");
    storyHeader.textContent = "Our Story";

    const paragraph = document.createElement("p");
    paragraph.textContent = `
        Sweet Scoops was founded with a simple mission: to craft delicious, 
        high-quality ice cream using the  best natural ingredients.
        From small batches to  handcrafted flavors , we put our heart into every scoop.
    `;

    const whyUsHeader = document.createElement("h1");
    whyUsHeader.textContent = "Why Choose Us?";


    const list = document.createElement("ul");
    const listItems = [
        createListItem("✅ 100% Natural Ingredients - No artificial flavors or preservatives."),
        createListItem("✅ Freshly Made Daily - We churn fresh batches every morning."),
        createListItem("✅ Wide Variety of Flavors - From classic vanilla to unique seasonal creations."),
        createListItem("✅ Eco-Friendly Packaging - Because we care about the planet too! 🌍"),
    ];

    content.appendChild(storyHeader);
    content.appendChild(paragraph);
    content.appendChild(whyUsHeader);
    for (const item of listItems)
        list.appendChild(item);
    content.appendChild(list);
};

export default draw;
