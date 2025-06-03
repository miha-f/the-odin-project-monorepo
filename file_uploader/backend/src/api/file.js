import asyncHandler from 'express-async-handler';
import express from 'express';
import { createFileService } from '../services/file.js';
import { isAuthenticated } from '../middleware.js';

const router = express.Router();
router.use(isAuthenticated);

const FileService = createFileService();

// TODO(miha): File routes should be auth protected!

router.get('/:uuid', asyncHandler(async (req, res) => {
    const file = await FileService.db.getByUuid(req.params.uuid);
    file ? res.json(file) : res.status(404).json({ error: 'Not found' });
}));

router.get('/:uuid/download', asyncHandler(async (req, res) => {
    const { uuid } = req.params;
    const { path, name } = await FileService.download(uuid);

    // TODO(miha): We hardoce path...
    res.download(`${path}/${name}`, name, (err) => {
        if (err) {
            res.status(500).send('Error downloading file');
        }
    });
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
