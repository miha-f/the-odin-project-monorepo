const asyncHandler = require("express-async-handler");
const { Item: ItemModel } = require("../models/models.js");
const NotFoundError = require("../errors/notFoundError.js");

const Item = () => {

    const getAll = asyncHandler(async (req, res) => {
        const items = await ItemModel.getAll(10, 10);
        // TODO(miha): render itemList.ejs template
        res.render('items', { items: items });
    });

    const getById = asyncHandler(async (req, res) => {
        const { itemId } = req.params;
        const itemDb = await ItemModel.findByIdDetailed(itemId);
        if (!itemDb) {
            throw new NotFoundError("Item not found");
        }
        const item = {
            ...itemDb,
            updatedAtFormatted: new Date(itemDb.updated_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            createdAtFormatted: new Date(itemDb.created_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        };

        res.render("item", { item: item });
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
