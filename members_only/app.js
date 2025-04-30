require("dotenv").config();
const { renderLayout, queryBuilder, auth } = require("./middlewares.js");
const path = require('path');
const express = require("express");
const app = express();

const { usersRouter, postsRouter } = require("./routes.js");

// NOTE(miha): Setup EJS.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// NOTE(miha): Middleware for layout render
app.use(renderLayout);
// NOTE(miha): Middleware for buidling query params (search, pagination, sort)
app.use(queryBuilder);

// NOTE(miha): Middleware for accepting form data
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.use((err, req, res, next) => {
    switch (err.statusCode || 500) {
        case 404: res.render("404", { errorMessage: err.message }); break;
        default: res.render("error"); break;
    }
});


app.get("/", (req, res) => {
    res.render("index");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server, listening on port ${PORT}!`);
});
