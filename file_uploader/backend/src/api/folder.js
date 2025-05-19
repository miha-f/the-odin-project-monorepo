import asyncHandler from 'express-async-handler';
import express from 'express';
import { createFolderService } from '../services/folder.js';
import { createFileService } from '../services/file.js';
import { upload } from '../middleware.js';

const router = express.Router();

const FolderService = createFolderService();
const FileService = createFileService();

// router.get('/', asyncHandler(async (_, res) => {
//     res.json(await FolderService.db.getAll());
// }));

// router.get('/test', asyncHandler(async (_, res) => {
//     const parentFolderUuid = "76c29b6a-dd22-4b74-9a62-3181cb7a17ec";
//     const userUuid = "ac223cf2-918f-4849-a24c-0077805b9f56";
//     const folderName = "Images";
//     const { folder, path } = await FolderService.create(parentFolderUuid, userUuid, folderName);
//     console.log("api folder: ", folder);
//     console.log("api path: ", path);
//
//     return res.json({ folder: folder, path: path });
// }));


// NOTE(miha): We need to have parent folder structure:
// /root -> gives us root folder (and links to sub folder)
// /root/My Files

router.get('/root/*', asyncHandler(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const userId = req.user.id;
    const pathStr = req.params[0];
    const pathParts = ["root", ...pathStr.split("/").filter(Boolean)];

    const { folder, error } = await FolderService.browsePath(userId, pathParts);

    if (error)
        return res.status(404).json({ error: "Not found" });

    return res.send({ folder: folder });
}));

router.post('/root/*/upload',
    upload.array("files"),
    asyncHandler(async (req, res) => {
        if (!req.user) return res.status(401).json({ error: "Not authenticated" });
        if (!req.files) return res.status(400).json({ error: "No files" });

        const files = [];

        for (const file of req.files) {
            // TODO: currently we only upload to the /root
            const { error: _, result: folder } = await FolderService.db.getRootFolderByUserId(req.user.id);
            const { result, error } = await FileService.db.create(
                file.originalname,
                folder.id,
                req.user.id,
                file.size,
                file.mimetype,
            );

            if (error)
                return res.status(500).json({ error: "Internal server error" });

            files.push(result);
        }

        return res.send(files);
    }));

// TODO(miha): Should we ahve POST /id/:uuid/upload route?
// We should always have foldeUuid so this could benefitial for us

// NOTE(miha): We get specific folder
router.get('/id/:uuid', asyncHandler(async (req, res) => {
    const file = await FolderService.db.getByUuid(req.params.uuid);
    file ? res.json(file) : res.status(404).json({ error: 'Not found' });
}));

router.get('/id/:uuid/path', asyncHandler(async (req, res) => {
    const { error, result } = await FolderService.db.getPathByUuid(req.params.uuid);
    !error ? res.json({ path: result }) : res.status(404).json({ error: 'Not found' });
}));

router.post('/', asyncHandler(async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const userId = req.user.id;

    const { folder, path, error } = await FolderService.create(req.body.parentId, userId, req.body.name);
    if (error)
        return res.status(500).json({ error: 'Internal server error' });
    return res.status(201).json({ folder: folder, path: path });
}));

// TODO(miha): How do we want to update folder? Only name or also user? Im thinking 
// only folder name, folder path are OK to update
router.patch('/:uuid', asyncHandler(async (req, res) => {
    const file = await FolderService.update(req.params.uuid, req.body);
    res.json(file);
}));

// TODO(miha): We need to remove all its files (delete them) and them delete folder.
// I think we can get await with only deleting files from db (deleteMany).
router.delete('/:uuid', asyncHandler(async (req, res) => {
    await FolderService.db.delete(req.params.uuid);
    res.status(204).send();
}));

export default router;
