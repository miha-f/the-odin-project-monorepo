const { Router } = require("express");

const usersRouter = Router();
usersRouter.get("/", (req, res) => { res.send("ok"); });
usersRouter.get("/:userId", (req, res) => { res.send("ok"); });
usersRouter.get("/login", (req, res) => { res.send("ok"); });
usersRouter.get("/login", (req, res) => { res.send("ok"); });
usersRouter.get("/update", (req, res) => { res.send("ok"); });
usersRouter.get("/update", (req, res) => { res.send("ok"); });
usersRouter.get("/register", (req, res) => { res.send("ok"); });
usersRouter.get("/register", (req, res) => { res.send("ok"); });
usersRouter.get("/logout", (req, res) => { res.send("ok"); });

const postsRouter = Router();
postsRouter.get("/", (req, res) => { res.send("ok"); });

module.exports = {
    usersRouter,
    postsRouter,
};
