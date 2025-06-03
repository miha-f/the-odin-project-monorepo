import multer from "multer";
import path from "path";
import { createFolderService } from './services/folder.js';

const FolderService = createFolderService();

const multerStorageStrategy = multer.diskStorage({
    destination: async function(req, file, cb) {
        try {
            // NOTE(miha): We need to put right file under the right folder so
            // our FS structure is updated.
            const user = req.user;
            const localPath = path.join(user.id, "root", req.params[0]);
            // TODO(miha): Handle error
            const { error, result } = await FolderService.fs.create(localPath, true);
            cb(null, path.join(process.env.USERS_STORE_DIR, localPath));
        } catch (err) {
            cb(err);
        }
    },
    filename: function(req, file, cb) {
        // NOTE(miha): file.originalname is already renamed name (if user rename in FE). 
        //   In FE we upload with renamed name!
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: multerStorageStrategy });

export const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated())
        return res.status(401).json({ error: "Unauthorized" });
    next();
};

// TODO(miha): We need canAccessFolder function that checks if currently logged in user is
//   folder owner or if the folder is shared with us!
