import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export default function FriendSection({ friends }: { friends: { id: number; username: string }[] }) {
    const [open, setOpen] = useState(true);

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-row items-center text-xl font-bold mb-2"
            >
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />} Your Friends
            </button>
            {open && (
                <ul className="divide-y divide-gray-200">
                    {friends.map((friend) => (
                        <Link key={friend.id} to={`/users/${friend.id}`}>
                            <li className="py-3 px-2 hover:bg-gray-50 transition rounded cursor-pointer">
                                <p className="text-lg text-gray-800">{friend.username}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
