import asyncHandler from 'express-async-handler';
import express from 'express';
import { createShareService } from '../services/share.js';
import { createFolderService } from '../services/folder.js';

const router = express.Router();

const ShareService = createShareService();
const FolderService = createFolderService();

router.get('/:token', asyncHandler(async (req, res) => {
    const token = req.params.token;
    const { folder } = await ShareService.getByUuid(token);
    // TODO(miha): Handle error
    const { result: path, error: _ } = await FolderService.db.getPathByUuid(folder.id);
    res.json({ folder: { ...folder, path: path } });
}));

export default router;
