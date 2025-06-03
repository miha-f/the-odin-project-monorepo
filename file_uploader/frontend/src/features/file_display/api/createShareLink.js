import { api } from "@/api/client";
import { tryCatch } from '@/utils/tryCatch';

export const createShareLink = async (id) => {
    // TODO(miha): Handle error
    const [data, error] = await tryCatch(api.post(`/folders/id/${id}/share`));
    console.log(data);

    if (error)
        return { error: error };

    return { data: data.data };
};

