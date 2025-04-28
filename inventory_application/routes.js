const { Router } = require("express");
const Company = require("./controllers/companyController.js");
const Category = require("./controllers/categoryController.js");
const Stock = require("./controllers/stockController.js");

const companyRouter = Router();
companyRouter.get("/", Company.getAll);
companyRouter.get("/new", Company.createForm);
companyRouter.get("/:companyId", Company.getById);
companyRouter.get("/:companyId/edit", Company.editForm);
companyRouter.post("/:companyId/update", Company.createOrUpdate(true));
companyRouter.post("/", Company.createOrUpdate(false));
companyRouter.delete("/:companyId", Company.remove);

const categoryRouter = Router();
categoryRouter.get("/", Category.getAll);
categoryRouter.get("/new", Category.createForm);
categoryRouter.get("/:categoryId", Category.getById);
categoryRouter.get("/:categoryId/edit", Category.editForm);
categoryRouter.post("/:categoryId/update", Category.createOrUpdate(true));
categoryRouter.post("/", Category.createOrUpdate(false));
categoryRouter.delete("/:categoryId", Category.remove);

const stockRouter = Router();
stockRouter.get("/", Stock.getAll);
stockRouter.get("/new", Stock.createForm);
stockRouter.get("/:itemId", Stock.getById);
stockRouter.post("/", Stock.create);
stockRouter.patch("/:stockId", Stock.update);
stockRouter.delete("/:stockId", Stock.remove);

module.exports = {
    companyRouter,
    categoryRouter,
    stockRouter,
};
