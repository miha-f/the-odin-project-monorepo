import { useCallback, useEffect, useState } from 'react';
import { tryCatch } from '@/utils/tryCatch';
import { api } from '@/lib/apiClient';

type Response<T> = {
    msg: T,
}

export function useFetch<T>(endpoint: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data, error } = await tryCatch<Response<T>>(api.get(endpoint));
        if (error) setError(error);
        else setData(data?.msg ?? null);
        setLoading(false);
    }, [endpoint]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

