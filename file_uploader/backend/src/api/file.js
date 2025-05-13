import express from 'express';
import { createFileService } from '../services/file.js';

const router = express.Router();

const FileService = createFileService();

router.get('/', async (_, res) => {
    res.json(await FileService.getAll());
});

router.get('/:uuid', async (req, res) => {
    const file = await FileService.getByUuid(req.params.uuid);
    file ? res.json(file) : res.status(404).json({ error: 'Not found' });
});

router.post('/', async (req, res) => {
    const file = await FileService.create(req.body);
    res.status(201).json(file);
});

router.patch('/:uuid', async (req, res) => {
    const file = await FileService.update(req.params.uuid, req.body);
    res.json(file);
});

router.delete('/:uuid', async (req, res) => {
    await FileService.delete(req.params.uuid);
    res.status(204).send();
});


export default router;
