const asyncHandler = require("express-async-handler");
const postsModel = require("../models/postsModel.js");
const pagination = require("../helpers/pagination.js");
const formatDate = require("../helpers/formatDate.js");

const postsController = (() => {
    const getAll = asyncHandler(async (req, res) => {
        const { page, totalPages, offset, itemsPerPage } = await pagination(req.query.page, postsModel.getAllCount);
        const postsDb = await postsModel.getAllWithUserInfo(itemsPerPage, offset);
        const posts = formatDate(postsDb);
        res.render("posts", { posts: posts });
    });

    const getById = (id) => {
    };

    const create = () => {
    };

    const createPost = () => {
    };

    const removeById = (id) => {
    };

    const removeByIdPost = (id) => {
    };

    const updateById = (id) => {
    };

    const updateByIdPost = (id) => {
    };

    return {
        getAll,
        getById,
        create,
        createPost,
        removeById,
        removeByIdPost,
        updateById,
        updateByIdPost,
    };
})();

module.exports = postsController;
