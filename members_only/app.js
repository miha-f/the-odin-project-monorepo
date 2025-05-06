require("dotenv").config();
const { renderLayout, queryBuilder, addUserToLocals } = require("./middlewares.js");
const path = require('path');
const bcrypt = require("bcryptjs");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const usersModel = require("./models/usersModel.js");
const app = express();

const { usersRouter, postsRouter } = require("./routes.js");

// NOTE(miha): Setup EJS.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// NOTE(miha): Middleware for accepting form data
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "default",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await usersModel.getByEmailWithPasswordHash(email);
                if (!user)
                    return done(null, false, { message: "Email not found" });

                const match = await bcrypt.compare(password, user.password_hash);
                if (!match)
                    return done(null, false, { message: "Wrong password" })

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
);

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await usersModel.getByEmailWithPasswordHash(email);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(addUserToLocals);

// NOTE(miha): Middleware for layout render
app.use(renderLayout);
// NOTE(miha): Middleware for buidling query params (search, pagination, sort)
app.use(queryBuilder);

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
    res.redirect("/posts");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server, listening on port ${PORT}!`);
});
