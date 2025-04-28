require("dotenv").config();
const { renderLayout, queryBuilder } = require("./middlewares.js");
const path = require('path');
const express = require("express");
const app = express();

const { companyRouter, categoryRouter, stockRouter } = require("./routes.js");

// NOTE(miha): Setup EJS.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// NOTE(miha): Middleware for layout render
app.use(renderLayout);
// NOTE(miha): Middleware for buidling query params (search, pagination, sort)
app.use(queryBuilder);

// NOTE(miha): Middleware for accepting form data
app.use(express.urlencoded({ extended: true }));

// NOTE(miha): Register function to the EJS
app.locals.getCurrentYear = () => {
    return new Date().getFullYear();
};

app.use(express.static(path.join(__dirname, 'public')));

app.use("/companies", companyRouter);
app.use("/categories", categoryRouter);
app.use("/stocks", stockRouter);

app.use((err, req, res, next) => {
    switch (err.statusCode || 500) {
        case 404: res.render("404", { errorMessage: err.message }); break;
        default: res.render("error"); break;
    }
});


app.get("/", (req, res) => {
    res.redirect('/stocks');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`My first Express app - listening on port ${PORT}!`);
});
