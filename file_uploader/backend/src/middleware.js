import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { createFolderService } from './services/folder.js';

const FolderService = createFolderService();

// TODO(miha): At the start we should just upload to user root folder.
// No need to be fancy or anything :)

const multerStorageStrategy = multer.diskStorage({
    destination: async function(req, file, cb) {
        try {
            const user = req.user;
            const localPath = path.join(process.env.USERS_STORE_DIR, user.id, "root");
            cb(null, localPath);
        } catch (err) {
            cb(err);
        }
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: multerStorageStrategy });
