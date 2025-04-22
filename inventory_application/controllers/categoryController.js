const asyncHandler = require("express-async-handler");
const { Category: CategoryModel } = require("../models/models.js");

const Category = () => {

    const getAll = asyncHandler(async (req, res) => {
        const categories = await CategoryModel.getAll();
        res.send(categories);
    });

    const getById = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const category = await CategoryModel.findById(categoryId);
        res.send(category);
    });

    const create = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const category = await CategoryModel.create(categoryId);
        res.send(category);
    });

    const update = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const category = await CategoryModel.update(categoryId);
        res.send(category);
    });

    const remove = asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const category = await CategoryModel.delete(categoryId);
        res.send(category);
    });

    return { getAll, getById, create, update, remove };
};

module.exports = Category();
