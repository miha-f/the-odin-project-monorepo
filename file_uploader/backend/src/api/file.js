import asyncHandler from 'express-async-handler';
import express from 'express';
import { createFileService } from '../services/file.js';

const router = express.Router();

const FileService = createFileService();

// TODO(miha): File routes should be auth protected!

// TODO(miha): This route doesn't make sense, we don't want to show
// all files! We want to show all files of the user if we are the user 
// (or files are shared with us).
router.get('/', asyncHandler(async (_, res) => {
    res.json(await FileService.getAll());
}));

router.get('/:uuid', asyncHandler(async (req, res) => {
    const file = await FileService.getByUuid(req.params.uuid);
    file ? res.json(file) : res.status(404).json({ error: 'Not found' });
}));

router.post('/', asyncHandler(async (req, res) => {
    const file = await FileService.create(req.body);
    res.status(201).json(file);
}));

router.patch('/:uuid', asyncHandler(async (req, res) => {
    const file = await FileService.update(req.params.uuid, req.body);
    res.json(file);
}));

router.delete('/:uuid', asyncHandler(async (req, res) => {
    await FileService.delete(req.params.uuid);
    res.status(204).send();
}));

export default router;
