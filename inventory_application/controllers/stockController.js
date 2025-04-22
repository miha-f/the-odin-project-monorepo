const asyncHandler = require("express-async-handler");
const { Stock: StockModel } = require("../models/models.js");

const Stock = () => {

    const getAll = asyncHandler(async (req, res) => {
        const stocks = await StockModel.getAll();
        res.send(stocks);
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
