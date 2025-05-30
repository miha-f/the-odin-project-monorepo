import { api } from './client';
import { tryCatch } from '../utils/tryCatch';

export const remove = async (fileId) => {
    const [data, error] = await tryCatch(api.delete(`/files/${fileId}`));
    console.log("DELETE /files/:uuid");
    console.log(data);
    console.log(error);
    if (error)
        return { error: error };
    return { data: data.data };
}

export const update = async (folderId, newName) => {
    const [data, error] = await tryCatch(api.patch(`/files/${folderId}`, { name: newName }));
    if (error)
        return { error: error };
    return { data: data.data };
}
