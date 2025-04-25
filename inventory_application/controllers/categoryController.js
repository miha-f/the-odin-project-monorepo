const asyncHandler = require("express-async-handler");
const { Category: CategoryModel } = require("../models/models.js");
const { body, validationResult } = require("express-validator");

const alphaNumErr = "must only contain letters or numbers."
const notEmptyErr = "must not be empty."

const validateForm = [
    body("categoryName").trim()
        .notEmpty().withMessage(`Category name ${notEmptyErr}`)
        .isAlphanumeric().withMessage(`Category name ${alphaNumErr}`),
];

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
        const categoryDb = await CategoryModel.findById(categoryId);
        if (!categoryDb) {
            throw new NotFoundError("Category not found");
        }
        const category = {
            ...categoryDb,
            updatedAtFormatted: new Date(categoryDb.updated_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            createdAtFormatted: new Date(categoryDb.created_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        };

        res.render("category", { category: category });
    });

    const createForm = asyncHandler(async (req, res) => {
        res.render('categoriesNew', { formData: {}, formErrors: {} });
    });

    const create = [
        validateForm,
        asyncHandler(async (req, res) => {
            const { categoryName } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formData = {
                    categoryName: categoryName,
                };
                const formErrors = {};
                errors.errors.forEach(err => {
                    if (!formErrors[err.path])
                        formErrors[err.path] = [];
                    formErrors[err.path].push(err.msg);
                });
                res.render('categoriesNew', { formData: formData, formErrors: formErrors });
                return;
            }

            const category = await CategoryModel.create(categoryName);
            if (!category) {
                throw new DbError("Couldn't create category");
            }

            res.redirect(`categories/${category.id}`);
        })];

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

    return { getAll, getById, createForm, create, update, remove };
};

module.exports = Category();
