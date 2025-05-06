const { Router } = require("express");
const { auth, memberOrAdmin } = require("./middlewares.js");

const usersController = require("./controllers/usersController.js");
const postsController = require("./controllers/postsController.js");

const usersRouter = Router();
usersRouter.get("/login", usersController.login);
usersRouter.post("/login", usersController.loginPost);
usersRouter.get("/register", usersController.register);
usersRouter.post("/register", usersController.registerPost);
usersRouter.post("/logout", auth, usersController.logoutPost);
usersRouter.get("/:userId", usersController.getById);

const postsRouter = Router();
postsRouter.get("/", postsController.getAll);
postsRouter.get("/create", postsController.create);
postsRouter.get("/:postId/update", postsController.updateById);
postsRouter.post("/create", auth, postsController.createOrUpdateByIdPost(false));
postsRouter.post("/:postId/update", auth, postsController.createOrUpdateByIdPost(true));
postsRouter.post("/:postId/remove", auth, memberOrAdmin, postsController.removeByIdPost);
postsRouter.get("/:postId", postsController.getById);

module.exports = {
    usersRouter,
    postsRouter,
};
