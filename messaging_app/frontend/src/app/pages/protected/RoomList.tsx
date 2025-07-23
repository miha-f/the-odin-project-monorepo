import { api } from "@/lib/apiClient";
import { tryCatch } from "@/utils/tryCatch";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Response<T> = {
    msg: T,
}

type Room = {
    id: number,
    name: string,
    is_private: boolean,
    created_at: string,
    created_by: number,
}

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await tryCatch<Response<{ rooms: Room[] }>>(api.get("/rooms/me"));
            setError(error);
            setRooms(data?.msg.rooms ?? []);
            setLoading(false);
        }

        fetch();
    }, []);

    if (error) return <p className="text-red-500 p-4">Something went wrong...</p>;
    if (loading) return <p className="text-gray-500 p-4">Loading...</p>;
    if (rooms.length === 0) return <p className="text-gray-500 p-4">No rooms found.</p>;

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Your Rooms</h2>
            <ul className="divide-y divide-gray-200">
                {rooms.map((room) => (
                    <Link
                        key={room.id}
                        to={`/rooms/${room.id}`}
                    >
                        <li
                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition rounded cursor-pointer"
                        >
                            <div>
                                <p className="text-lg font-medium text-gray-800">{room.name}</p>
                                <p className="text-sm text-gray-500">
                                    {room.is_private ? "Private" : "Public"} •{" "}
                                    {new Date(room.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <span
                                className={`inline-block text-xs px-2 py-1 rounded-full ${room.is_private
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {room.is_private ? "Private" : "Public"}
                            </span>
                        </li>
                    </Link>
                ))}
            </ul>
        </>
    );
}
