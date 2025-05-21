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
