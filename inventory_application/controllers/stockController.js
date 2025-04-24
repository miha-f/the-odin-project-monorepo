const asyncHandler = require("express-async-handler");
const { Stock: StockModel, Item: ItemModel } = require("../models/models.js");

const Stock = () => {

    const getAll = asyncHandler(async (req, res) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const totalItems = (await ItemModel.getAllCount()).count;
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

    const create = asyncHandler(async (req, res) => {
        const { stockId } = req.params;
        const stock = await StockModel.create(stockId);
        res.send(stock);
    });

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

    return { getAll, getById, create, update, remove };
};

module.exports = Stock();
