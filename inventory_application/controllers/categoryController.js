const asyncHandler = require("express-async-handler");
const { Category: CategoryModel } = require("../models/models.js");

const Category = () => {

    const getAll = asyncHandler(async (req, res) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const totalItems = (await CategoryModel.getAllCount()).count;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const categoriesDb = await CategoryModel.getAll(ITEMS_PER_PAGE, offset);
        const categories = categoriesDb.map(category => ({
            ...category,
            formattedDate: new Date(category.updated_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        }));

        res.render('categories', { categories: categories, page: page, totalPages: totalPages });
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
