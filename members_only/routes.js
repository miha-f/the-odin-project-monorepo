const { Router } = require("express");

const postsController = require("./controllers/postsController.js");

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
postsRouter.get("/", postsController.getAll);
postsRouter.get("/create", postsController.create);
postsRouter.get("/update/:postId", postsController.updateById);
postsRouter.post("/create", postsController.createOrUpdateByIdPost(false));
postsRouter.post("/update/:postId", postsController.createOrUpdateByIdPost(true));
postsRouter.post("/remove/:postId", postsController.removeByIdPost);
postsRouter.get("/:postId", postsController.getById);

module.exports = {
    usersRouter,
    postsRouter,
};
