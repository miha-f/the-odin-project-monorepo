import { search as searchApi } from "@/api/search";
import { useState, useEffect } from "react";

export const useSearch = (query) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            if (!query.trim()) return;

            setLoading(true);
            setError(null);
            try {
                const results = await searchApi(query);
                console.log("useSearch: ", results);
                setData(results);
            } catch (err) {
                setError(err.message || "Search failed");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [query]);

    return { data, loading, error };
};

