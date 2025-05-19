import asyncHandler from 'express-async-handler';
import express from 'express';
import { createUserService } from '../services/user.js';

const router = express.Router();

const UserService = createUserService();

router.get('/', asyncHandler(async (_, res) => {
    res.json(await UserService.getAll());
}));

router.get('/:uuid', asyncHandler(async (req, res) => {
    const file = await UserService.getByUuid(req.params.uuid);
    file ? res.json(file) : res.status(404).json({ error: 'Not found' });
}));

// NOTE(miha): Only way to create user is via /auth/register
// router.post('/', async (req, res) => {
//     const file = await UserService.create(req.body);
//     res.status(201).json(file);
// });

router.patch('/:uuid', asyncHandler(async (req, res) => {
    const file = await UserService.update(req.params.uuid, req.body);
    res.json(file);
}));

router.delete('/:uuid', asyncHandler(async (req, res) => {
    await UserService.delete(req.params.uuid);
    res.status(204).send();
}));

export default router;
