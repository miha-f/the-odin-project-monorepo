import prisma from '../db/prisma.js';
import { createFolderService } from '../services/folder.js';
import withCatch from '../helpers/withCatch.js';

const FolderService = createFolderService();

const getLinkByFolderId = async (folderUuid, client = prisma) => {
    const [error, result] = await withCatch(() => client.folderShareLink.findMany(
        {
            where: { folderId: folderUuid },
        }));

    if (error)
        return { error: "Database error" };

    const link = result.length ? result[0].token : undefined;
    return { link };
}

export const createShareService = () => ({
    getByUuid: async (uuid, client = prisma) => {
        const [dbError, dbResult] = await withCatch(() => client.folderShareLink.findUnique(
            {
                where: { token: uuid },
            }));
        if (dbError)
            return { error: "Database error" };

        // TODO(miha): Handle error
        const { result, error } = await FolderService.db.getByUuid(dbResult.folderId);

        return { folder: result };
    },

    getLinkByFolderId: getLinkByFolderId,

    create: async (folderId, client = prisma) => {
        // NOTE(miha): First check if share link for folder already exists so
        // we don't create multiple links for same folder.
        const { link } = await getLinkByFolderId(folderId);
        if (link) return link;

        // TODO(miha): Access is currently always EDIT
        const access = "EDIT";
        // TODO(miha): ExpiresAt is always undefined/null for now - means non expiration.
        const token = crypto.randomUUID();
        const shareLink = await client.folderShareLink.create({
            data: {
                folderId: folderId,
                token: token,
                access: access,
            },
        })
        await FolderService.db.update(folderId, { shareLinks: [shareLink] });

        return token;
    },

    // TODO: Also call this when folder is deleted
    delete: async (uuid, client = prisma) =>
        await client.user.delete({
            where: { id: uuid },
        }),
});
