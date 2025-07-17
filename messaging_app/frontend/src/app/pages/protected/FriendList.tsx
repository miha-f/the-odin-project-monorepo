import { api } from "@/lib/apiClient";
import { tryCatch } from "@/utils/tryCatch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Response<T> = {
    msg: T,
}

type Friend = {
    username: string,
    id: number,
}

export default function FriendList() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await tryCatch<Response<{ friends: Friend[] }>>(api.get("/users/me/friends"));
            setError(error);
            setFriends(data?.msg.friends ?? []);
            setLoading(false);
        }

        fetch();
    }, []);

    if (error) return <p className="text-red-500 p-4">Something went wrong...</p>;
    if (loading) return <p className="text-gray-500 p-4">Loading...</p>;
    if (friends.length === 0) return <p className="text-gray-500 p-4">No rooms found.</p>;

    return (
        <div className="w-full max-w-6xl mx-auto mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Your Friends</h2>
            <ul className="divide-y divide-gray-200">
                {friends.map((friend) => (
                    <Link
                        key={friend.id}
                        to={`/users/${friend.id}`}
                    >
                        <li
                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition rounded cursor-pointer"
                        >
                            <p className="text-lg font-medium text-gray-800">{friend.username}</p>
                        </li>
                    </Link>
                ))}
            </ul>
        </div >
    );
}
