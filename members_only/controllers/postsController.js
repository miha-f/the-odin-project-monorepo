const asyncHandler = require("express-async-handler");
const postsModel = require("../models/postsModel.js");
const pagination = require("../helpers/pagination.js");
const formatDate = require("../helpers/formatDate.js");
const getFormErrorsMap = require("../helpers/formErrors.js");
const { body, validationResult } = require("express-validator");
const { alphaNumErr, notEmptyErr } = require("../errors/validationErrors.js");

const validateForm = [
    body("title").trim()
        .notEmpty().withMessage(`Title ${notEmptyErr}`)
        .matches(/^[\p{L}\p{N} ]+$/u).withMessage(`Item name ${alphaNumErr}`),
    body("text").trim()
        .notEmpty().withMessage(`Text ${notEmptyErr}`),
];

const postsController = (() => {
    const getAll = asyncHandler(async (req, res) => {
        const { page, totalPages, offset, itemsPerPage } = await pagination(req.query.page, postsModel.getAllCount);
        const postsDb = await postsModel.getAllWithUserInfo(itemsPerPage, offset);
        const posts = formatDate(postsDb);
        res.render("posts", { posts: posts, page: page, totalPages: totalPages });
    });

    const getById = asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const postDb = await postsModel.getByIdWithUserInfo(postId);
        const post = formatDate(postDb);
        res.render("post", { post: post });
    });

    const create = asyncHandler(async (req, res) => {
        res.render("postForm", { postId: undefined, formData: {}, formErrors: {} });
    });

    const createOrUpdateByIdPost = (isEdit = false) => {
        return [
            validateForm,
            asyncHandler(async (req, res) => {
                console.log("a");
                const postId = isEdit ? req.params.postId : undefined;
                const { title, text } = req.body;
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const formData = {
                        title: title,
                        text: text,
                    };
                    const formErrors = getFormErrorsMap(errors);
                    res.render('postForm', { postId: postId, formData: formData, formErrors: formErrors });
                    return;
                }

                let post = undefined;
                const userId = 30; // TODO(miha): Get it from the req (auth middleware adds user info!)
                if (!isEdit) {
                    post = await postsModel.create({ title, text, userId });
                }
                else {
                    post = await postsModel.updateById(postId, { title, text });
                }

                if (!post) {
                    throw new Error("Couldn't create/update post"); // TODO(miha): Custom errors (/errors/errors.js)
                }

                res.redirect(`/posts/${post.id}`);
            })
        ]
    };

    const removeByIdPost = asyncHandler(async (req, res) => {
    });

    const updateById = asyncHandler(async (req, res) => {
    });

    return {
        getAll,
        getById,
        create,
        createOrUpdateByIdPost,
        removeByIdPost,
        updateById,
    };
})();

module.exports = postsController;
