const { Router } = require("express");

const itemRouter = Router();
itemRouter.get("/", (req, res) => res.send("all items"));
itemRouter.get("/:itemId", (req, res) => {
    const { itemId } = req.params;
    res.send(`item: ${itemId}`);
});
itemRouter.post("/", (req, res) => res.send("create item"));
itemRouter.patch("/:itemId", (req, res) => {
    const { itemId } = req.params;
    res.send(`update item: ${itemId}`);
});
itemRouter.delete("/:itemId", (req, res) => {
    const { itemId } = req.params;
    res.send(`delete item: ${itemId}`);
});

const companyRouter = Router();
companyRouter.get("/", (req, res) => res.send("all companys"));
companyRouter.get("/:companyId", (req, res) => {
    const { companyId } = req.params;
    res.send(`company: ${companyId}`);
});
companyRouter.post("/", (req, res) => res.send("create company"));
companyRouter.patch("/:companyId", (req, res) => {
    const { companyId } = req.params;
    res.send(`update company: ${companyId}`);
});
companyRouter.delete("/:companyId", (req, res) => {
    const { companyId } = req.params;
    res.send(`delete company: ${companyId}`);
});

const categoryRouter = Router();
categoryRouter.get("/", (req, res) => res.send("all categorys"));
categoryRouter.get("/:categoryId", (req, res) => {
    const { categoryId } = req.params;
    res.send(`category: ${categoryId}`);
});
categoryRouter.post("/", (req, res) => res.send("create category"));
categoryRouter.patch("/:categoryId", (req, res) => {
    const { categoryId } = req.params;
    res.send(`update category: ${categoryId}`);
});
categoryRouter.delete("/:categoryId", (req, res) => {
    const { categoryId } = req.params;
    res.send(`delete category: ${categoryId}`);
});

module.exports = {
    itemRouter,
    companyRouter,
    categoryRouter,
};
