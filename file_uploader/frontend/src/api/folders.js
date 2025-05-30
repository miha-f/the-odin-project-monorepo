import { api } from './client';
import { tryCatch } from '../utils/tryCatch';

export const getFolder = async (path) => {
    const [data, error] = await tryCatch(api.get(`/folders/${path}`));
    if (error)
        return { error: error };
    return { data: data.data };
}

export const getRoot = async () => {
    const [data, error] = await tryCatch(api.get('/folders/root/'));
    if (error)
        return { error: error };
    return { data: data.data };
}

export const uploadFiles = async (files) => {
    const formData = new FormData();

    files.forEach(({ file, name }) => {
        const renamedFile = new File([file], name, { type: file.type });
        formData.append('files', renamedFile);
    });

    // TODO(miha): Make sure we don't have duplicate names here.
    // TODO(miha): Also make sure we do server validation and ensure
    // that we don't have duplicate names there...

    console.log("upload files");
    console.log(formData);

    // TODO(miha): Set better url to upload - we currently upload to root.
    const [data, error] = await tryCatch(api.post('/folders/root/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }
    ));

    if (error)
        return { error: error };
    return { data: data.data };
};

export const create = async (folderId, name) => {
    const [data, error] = await tryCatch(api.post('/folders/',
        { parentId: folderId, name: name },
        { headers: { 'Content-Type': 'application/json' } })
    );
    if (error)
        return { error: error };
    return { data: data.data };
}

export const remove = async (folderId) => {
    const [data, error] = await tryCatch(api.delete(`/folders/${folderId}`));
    if (error)
        return { error: error };
    return { data: data.data };
}

export const update = async (folderId, newName) => {
    const [data, error] = await tryCatch(api.patch(`/folders/${folderId}`, { name: newName }));
    if (error)
        return { error: error };
    return { data: data.data };
}
