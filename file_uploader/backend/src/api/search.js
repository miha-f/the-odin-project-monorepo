import express from 'express';
import asyncHandler from 'express-async-handler';
import { isAuthenticated } from '../middleware.js';
import { createSearchService } from '../services/search.js';
import { createFolderService } from '../services/folder.js';

const router = express.Router();
router.use(isAuthenticated);

const SearchService = createSearchService();
const FolderService = createFolderService();

router.get('/', asyncHandler(async (req, res) => {
    const { q } = req.query;
    // TODO(miha): Handle error
    const { result: fileResult, error: fileError } = await SearchService.files(req.user.id, q);
    // TODO(miha): Handle error
    const { result: folderResult, error: folderError } = await SearchService.folders(req.user.id, q);

    const files = await Promise.all(fileResult.map(async (file) => {
        // TODO(miha): Handle error
        const { result, error } = await FolderService.db.getPathByUuid(file.folderId);
        return { ...file, path: result };
    }));

    const folders = await Promise.all(folderResult.map(async (folder) => {
        // TODO(miha): Handle error
        const { result, error } = await FolderService.db.getPathByUuid(folder.id);
        return { ...folder, path: result };
    }));

    res.json({ folders: folders, files: files });
}));

export default router;
