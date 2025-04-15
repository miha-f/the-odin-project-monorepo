const draw = () => {
    const content = document.querySelector("#content");

    const header = document.createElement("h1");
    header.textContent = "Welcome to Sweet Scoops! 🍦";

    const paragraph = document.createElement("p");
    paragraph.textContent = `
                We serve up the creamiest and most delightful ice creams made from
                fresh, natural ingredients.Whether you love classic flavors or daring new tastes, we
                have a scoop waiting for you! 🍨
    `;

    content.appendChild(header);
    content.appendChild(paragraph);
};

export default draw;
