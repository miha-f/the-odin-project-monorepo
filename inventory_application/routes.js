const { Router } = require("express");
const Item = require("./controllers/itemController.js");
const Company = require("./controllers/companyController.js");
const Category = require("./controllers/categoryController.js");
const Stock = require("./controllers/stockController.js");

const itemRouter = Router();
itemRouter.get("/", Item.getAll);
itemRouter.get("/:itemId", Item.getById);
itemRouter.post("/", Item.create);
itemRouter.patch("/:itemId", Item.update);
itemRouter.delete("/:itemId", Item.remove);

const companyRouter = Router();
companyRouter.get("/", Company.getAll);
companyRouter.get("/new", Company.createForm);
companyRouter.get("/:companyId", Company.getById);
companyRouter.post("/", Company.create);
companyRouter.patch("/:companyId", Company.update);
companyRouter.delete("/:companyId", Company.remove);

const categoryRouter = Router();
categoryRouter.get("/", Category.getAll);
categoryRouter.get("/new", Category.createForm);
categoryRouter.get("/:categoryId", Category.getById);
categoryRouter.post("/", Category.create);
categoryRouter.patch("/:categoryId", Category.update);
categoryRouter.delete("/:categoryId", Category.remove);

const stockRouter = Router();
stockRouter.get("/", Stock.getAll);
stockRouter.get("/new", Stock.createForm);
stockRouter.get("/:stockId", Stock.getById);
stockRouter.post("/", Stock.create);
stockRouter.patch("/:stockId", Stock.update);
stockRouter.delete("/:stockId", Stock.remove);

module.exports = {
    itemRouter,
    companyRouter,
    categoryRouter,
    stockRouter,
};
