import { useEffect } from '@lynx-js/react'

import './App.css'
import { BASE_URL } from '@/lib/apiClient.js'
import { useState } from '@lynx-js/react/legacy-react-runtime'

interface Blog {
    id: number;
    authorId: string;
    title: string;
    content: string;
    image?: string;
    updatedAt: Date;
    createdAt: Date;
};

export function App() {

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(BASE_URL + "/blogs?limit=100");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setBlogs(data.data);
            } catch (err) {
                setError("Failed to fetch blogs error");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [])

    if (loading) return <text>Loading...</text>;
    if (error) return <text>{error}</text>;

    return (
        <>
            <text>hello from app</text>
            <text>hello from app</text>
        </>
    )
}
