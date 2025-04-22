require("dotenv").config();
const { renderLayout } = require("./middlewares.js");
const path = require('path');
const express = require("express");
const app = express();

const { itemRouter, companyRouter, categoryRouter, stockRouter } = require("./routes.js");

// NOTE(miha): Setup EJS.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// NOTE(miha): Middleware for layout render
app.use(renderLayout);

// NOTE(miha): Middleware for accepting form data
app.use(express.urlencoded({ extended: true }));

// NOTE(miha): Register function to the EJS
app.locals.getCurrentYear = () => {
    return new Date().getFullYear();
};

app.use(express.static(path.join(__dirname, 'public')));

app.use("/items", itemRouter);
app.use("/companies", companyRouter);
app.use("/categories", categoryRouter);
app.use("/stocks", stockRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});


app.get("/", (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`My first Express app - listening on port ${PORT}!`);
});
