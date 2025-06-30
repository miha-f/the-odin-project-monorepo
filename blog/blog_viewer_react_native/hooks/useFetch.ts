import { useState, useEffect, useCallback } from 'react';

type ApiResponse<T> = {
    data?: T;
    error?: string;
};

type FetchState<T> = {
    data: T | null;
    error: string | null;
    loading: boolean;
    refetch: () => void;
};

export function useFetch<T>(url: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadKey, setReloadKey] = useState(0);

    const refetch = useCallback(() => {
        setReloadKey(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!url) return;

        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json: ApiResponse<T> = await res.json();

                if (isMounted) {
                    if (json.error) {
                        setError(json.error);
                        setData(null);
                    } else if ('data' in json) {
                        setData(json.data ?? null);
                        setError(null);
                    } else {
                        setError("Malformed API response");
                        setData(null);
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'Unknown error');
                    setData(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [url, reloadKey]);

    return { data, error, loading, refetch };
}
