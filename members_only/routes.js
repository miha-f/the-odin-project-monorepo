const { Router } = require("express");

const usersController = require("./controllers/usersController.js");
const postsController = require("./controllers/postsController.js");

const usersRouter = Router();
usersRouter.get("/", usersController.getAll);
usersRouter.get("/login", usersController.login);
usersRouter.post("/login", usersController.loginPost);
usersRouter.get("/register", usersController.register);
usersRouter.post("/register", usersController.registerPost);
usersRouter.post("/logout", usersController.logoutPost);
usersRouter.get("/:userId", usersController.getById);

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
