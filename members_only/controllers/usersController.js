const asyncHandler = require("express-async-handler");
const usersModel = require("../models/usersModel.js");
const pagination = require("../helpers/pagination.js");
const postsModel = require("../models/postsModel.js");
const formatDate = require("../helpers/formatDate.js");
const bcrypt = require("bcryptjs");
const getFormErrorsMap = require("../helpers/formErrors.js");
const { body, validationResult } = require("express-validator");
const { alphaNumErr, notEmptyErr } = require("../errors/validationErrors.js");
const passport = require("passport");

const validateLoginForm = [
    body("email").trim()
        .notEmpty().withMessage(`Email ${notEmptyErr}`)
        .isEmail().withMessage(`Email not valid.`),
    body("password").trim()
        .notEmpty().withMessage(`Password ${notEmptyErr}`)
        .isLength({ min: 5 }).withMessage(`Password is too short.`),
];

const validateRegisterForm = [
    body("username").trim()
        .notEmpty().withMessage(`Username ${notEmptyErr}`)
        .custom(async (username) => {
            const user = await usersModel.getByUsername(username);
            if (user) {
                throw new Error('Username already in use');
            }
        }),
    body("email").trim()
        .notEmpty().withMessage(`Email ${notEmptyErr}`)
        .isEmail().withMessage(`Email not valid.`)
        .custom(async (email) => {
            const user = await usersModel.getByEmail(email);
            if (user) {
                throw new Error('Email already in use');
            }
        }),
    body("password1").trim()
        .notEmpty().withMessage(`Password ${notEmptyErr}`)
        .isLength({ min: 5 }).withMessage(`Password is too short.`),
    body("password2").trim()
        .custom((value, { req }) => {
            if (value !== req.body.password1) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('role').trim()
        .exists().withMessage('Role is required')
        .isIn(['user', 'member', 'admin']).withMessage('Invalid role selected'),
];

const usersController = (() => {

    const getById = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const paginationCallback = () => postsModel.getAllByUserIdCount(userId);
        const { page, totalPages, offset, itemsPerPage } = await pagination(req.query.page, paginationCallback);
        const userPostsDb = await postsModel.getAllByUserId(userId, itemsPerPage, offset);
        const userPosts = formatDate(userPostsDb);
        res.render("user", { userPosts: userPosts, page: page, totalPages: totalPages });
    });

    const login = asyncHandler(async (req, res) => {
        return res.render("loginForm", { userId: undefined, formData: {}, formErrors: {} });
    });

    const loginPost = [
        validateLoginForm,
        asyncHandler(async (req, res, next) => {
            const { email } = req.body;
            const errors = validationResult(req);
            const formData = {
                email: email,
                password: '',
            };
            if (!errors.isEmpty()) {
                const formErrors = getFormErrorsMap(errors);
                return res.render('loginForm', { postId: postId, formData: formData, formErrors: formErrors });
            }

            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const formErrors = {
                        email: [],
                        password: [],
                        general: [],
                    };
                    if (info?.message === 'Email not found') {
                        formErrors.email.push(info.message);
                    } else if (info?.message === 'Wrong password') {
                        formErrors.password.push(info.message);
                    } else {
                        formErrors.general.push(info?.message || "Authentication failed");
                    }
                    return res.render("loginForm", { userId: undefined, formData: formData, formErrors: formErrors });
                }

                req.logIn(user, (err) => {
                    if (err) return next(err)
                    return res.redirect('/');
                });
            })(req, res, next);
        })
    ];

    const register = asyncHandler(async (req, res) => {
        res.render("registerForm", { userId: undefined, formData: {}, formErrors: {} });
    });

    const registerPost = [
        validateRegisterForm,
        asyncHandler(async (req, res) => {
            const { username, email, password1, role } = req.body;
            const errors = validationResult(req);
            const formData = {
                email: email,
                password: '',
            };

            if (!errors.isEmpty()) {
                const formErrors = getFormErrorsMap(errors);
                return res.render('registerForm', { userId: undefined, formData: formData, formErrors: formErrors });
            }

            const passwordHash = await bcrypt.hash(password1, 10);
            const user = await usersModel.create({ username, email, role, password_hash: passwordHash });
            req.logIn(user, (err) => {
                if (err) return next(err)
                return res.redirect('/');
            });
        }),
    ];

    const logoutPost = asyncHandler(async (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    });

    return {
        getById,
        login,
        loginPost,
        register,
        registerPost,
        logoutPost,
    };
})();

module.exports = usersController;
