import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import asyncHandler from 'express-async-handler';
import { createAuthService } from '../services/auth.js';
import { createUserService } from '../services/user.js';
import { createFolderService } from '../services/folder.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const AuthService = createAuthService();
const UserService = createUserService();

const notEmptyErr = "must not be empty."

const validateLoginForm = [
    body("username").trim()
        .notEmpty().withMessage(`Username ${notEmptyErr}`),
    body("password").trim()
        .notEmpty().withMessage(`Password ${notEmptyErr}`)
        .isLength({ min: 5 }).withMessage(`Password is too short.`),
];

const validateRegisterForm = [
    body("username").trim()
        .notEmpty().withMessage(`Username ${notEmptyErr}`)
        .custom(async (username) => {
            const user = await UserService.getByUsername(username);
            if (user) {
                throw new Error('Username already in use');
            }
        }),
    body("password").trim()
        .notEmpty().withMessage(`Password ${notEmptyErr}`)
        .isLength({ min: 5 }).withMessage(`Password is too short.`),
    body("passwordRepeat").trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];

router.get('/me', asyncHandler(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    res.json({ user: req.user });
}));

router.post('/register', [
    validateRegisterForm,
    asyncHandler(async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty())
            return res.status(400).json({ validationErrors: validationErrors });

        const { username, password } = req.body;
        const { user, rootFolder, error } = await AuthService.create(username, password);
        if (error) return res.status(400).json({ error: "Username already exists" });

        res.json({ data: { user: user, rootFolder: rootFolder } });
    })
]);

router.post('/login', [
    validateLoginForm,
    asyncHandler(async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty())
            return res.status(400).json({ validationErrors: validationErrors });

        passport.authenticate("local", (err, user, info) => {
            if (err)
                return next(err);

            if (!user) {
                if (info?.message === 'Email not found')
                    return res.status(400).json({ error: "Email not found" });
                else if (info?.message === 'Wrong password')
                    return res.status(400).json({ error: "Wrong password" });
                else
                    return res.status(400).json({ error: "Not authenticated" });
            }

            req.logIn(user, (err) => {
                if (err) return next(err)
                return res.json({ data: "Login" });
            });
        })(req, res, next);
    })
]);

router.post('/logout', asyncHandler(async (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.json({ data: "Logout" });
    });
}));

export default router;
