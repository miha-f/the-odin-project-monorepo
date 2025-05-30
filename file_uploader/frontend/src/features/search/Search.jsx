import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export const Search = () => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const navigate = useNavigate();

    useEffect(() => {
        if (debouncedQuery.trim()) {
            console.log("navigate to /search");
            navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
        }
    }, [debouncedQuery, navigate]);

    return (
        <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border rounded w-full"
        />
    );
}

