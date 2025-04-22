const asyncHandler = require("express-async-handler");
const { Item: ItemModel } = require("../models/models.js");

const Item = () => {

    const getAll = asyncHandler(async (req, res) => {
        const items = await ItemModel.getAll();
        res.send(items);
    });

    const getById = asyncHandler(async (req, res) => {
        const { itemId } = req.params;
        const item = await ItemModel.findById(itemId);
        if (!item) {
            throw new Error("OH NO!");
        }
        res.send(item);
    });

    const create = asyncHandler(async (req, res) => {
        const { itemId } = req.params;
        const item = await ItemModel.create(itemId);
        res.send(item);
    });

    const update = asyncHandler(async (req, res) => {
        const { itemId } = req.params;
        const item = await ItemModel.update(itemId);
        res.send(item);
    });

    const remove = asyncHandler(async (req, res) => {
        const { itemId } = req.params;
        const item = await ItemModel.delete(itemId);
        res.send(item);
    });

    return { getAll, getById, create, update, remove };
};

module.exports = Item();
