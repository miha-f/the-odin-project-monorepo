const asyncHandler = require("express-async-handler");
const { Stock: StockModel, Category: CategoryModel, Company: CompanyModel, Item: ItemModel } = require("../models/models.js");
const DbError = require("../errors/dbError.js");
const { body, validationResult } = require("express-validator");

const alphaNumErr = "must only contain letters or numbers."
const notEmptyErr = "must not be empty."
const positiveIntErr = "must be a positive (0+) integer."
const positiveFloatErr = "must be a positive (0+) float."

const validateForm = [
    body("itemName").trim()
        .notEmpty().withMessage(`Item name ${notEmptyErr}`)
        .isAlphanumeric().withMessage(`Item name ${alphaNumErr}`),
    body("categoryId").trim()
        .notEmpty().withMessage(`Category id ${notEmptyErr}`)
        .toInt(),
    body("companyId").trim()
        .notEmpty().withMessage(`Company id ${notEmptyErr}`)
        .toInt(),
    body("quantity").trim()
        .notEmpty().withMessage(`Quantity ${notEmptyErr}`)
        .isInt({ min: 0 }).withMessage(`Quantity ${positiveIntErr}`)
        .toInt(),
    body("price").trim()
        .notEmpty().withMessage(`Price ${notEmptyErr}`)
        .isFloat({ min: 0 }).withMessage(`Price ${positiveFloatErr}`)
        .toFloat(),
    body("description").trim()
        .notEmpty().withMessage(`Description ${notEmptyErr}`)
        .isAlphanumeric().withMessage(`Description ${alphaNumErr}`),
];

const Stock = () => {

    const getAll = asyncHandler(async (req, res) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const totalItems = (await StockModel.getAllCount()).count;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        const stocksDb = await StockModel.getAllDetailed(ITEMS_PER_PAGE, offset);
        const stocks = stocksDb.map(stock => ({
            ...stock,
            formattedDate: new Date(stock.updated_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        }));

        res.render('stocks', { stocks: stocks, page: page, totalPages: totalPages });
    });

    const getById = asyncHandler(async (req, res) => {
        const { stockId } = req.params;
        const stock = await StockModel.findById(stockId);
        res.send(stock);
    });

    const createForm = asyncHandler(async (req, res) => {
        const categories = await CategoryModel.getAll();
        const companies = await CompanyModel.getAll();
        res.render('stocksNew', { categories: categories, companies: companies, formData: {}, formErrors: {} });
    });

    const create = [
        validateForm,
        asyncHandler(async (req, res) => {
            const { itemName, categoryId, companyId, quantity, price, description } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const categories = await CategoryModel.getAll();
                const companies = await CompanyModel.getAll();
                const formData = {
                    itemName: itemName,
                    categoryId: categoryId,
                    companyId: companyId,
                    quantity: quantity,
                    price: price,
                    description: description,
                };
                const formErrors = {};
                errors.errors.forEach(err => {
                    if (!formErrors[err.path])
                        formErrors[err.path] = [];
                    formErrors[err.path].push(err.msg);
                });
                res.render('stocksNew', { categories: categories, companies: companies, formData: formData, formErrors: formErrors });
                return;
            }

            const item = await ItemModel.create(itemName, description, "https://placehold.co/100x100", categoryId, companyId);
            if (!item) {
                throw new DbError("Couldn't create item");
            }

            const stock = await StockModel.create(item.id, quantity, price);
            if (!stock) {
                throw new DbError("Couldn't create stock");
            }

            res.redirect(`items/${item.id}`);
        })];

    const update = asyncHandler(async (req, res) => {
        const { stockId } = req.params;
        const stock = await StockModel.update(stockId);
        res.send(stock);
    });

    const remove = asyncHandler(async (req, res) => {
        const { stockId } = req.params;
        const stock = await StockModel.delete(stockId);
        res.send(stock);
    });

    return { getAll, getById, createForm, create, update, remove };
};

module.exports = Stock();
