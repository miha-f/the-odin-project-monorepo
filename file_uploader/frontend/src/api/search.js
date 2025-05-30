import { api } from './client';
import { tryCatch } from '../utils/tryCatch';

export const search = async (query) => {
    const [data, error] = await tryCatch(api.get(`/search?q=${query}`));
    if (error)
        return { error: error };
    return { data: data.data };
}

