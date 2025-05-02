const asyncHandler = require("express-async-handler");

const usersController = (() => {

    const getAll = asyncHandler(async (req, res) => {
    });

    const getById = asyncHandler(async (req, res) => {
    });

    const login = asyncHandler(async (req, res) => {
    });

    const loginPost = asyncHandler(async (req, res) => {
    });

    const register = asyncHandler(async (req, res) => {
    });

    const registerPost = asyncHandler(async (req, res) => {
    });

    const logoutPost = asyncHandler(async (req, res) => {
    });

    return {
        getAll,
        getById,
        login,
        loginPost,
        register,
        registerPost,
        logoutPost,
    };
})();

module.exports = usersController;
