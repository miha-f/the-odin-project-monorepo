/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./views/**/*.ejs"],
    theme: {
        extend: {
            colors: {
                grape: "rgba(11, 35, 205)",
            },
        },
    },
    plugins: [],
};
