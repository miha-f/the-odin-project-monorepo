import { api } from '@/api/client';
import { tryCatch } from '@/utils/tryCatch';

export const getByToken = async (token) => {
    const [data, error] = await tryCatch(api.get(`/share/${token}`));
    console.log("Share, GetByToken: GET /share/:token");
    console.log(data);
    console.log(error);
    if (error)
        return { error: error };
    return { data: data.data };
}

