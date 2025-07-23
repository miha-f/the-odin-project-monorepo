// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
// import { type Incoming } from "@/models/Models";
//
// export default function IncomingRequestsSection({ incoming }: { incoming: Incoming[] }) {
//     const [open, setOpen] = useState(false);
//
//     return (
//         <div>
//             <button
//                 onClick={() => setOpen((prev) => !prev)}
//                 className="flex flex-row items-center text-xl font-bold mb-2"
//             >
//                 {open ? <ChevronDownIcon /> : <ChevronRightIcon />} Incoming Friend Requests
//             </button>
//
//             {open && (
//                 <ul>
//                     {incoming.length === 0 ? (
//                         <p className="text-gray-500 text-sm">No requests received.</p>
//                     ) : (
//                         incoming.map((req) => (
//                             <Link key={req.id} to={`/users/${req.sender_id}`}>
//                                 <li className="py-2 px-2 hover:bg-gray-50 rounded cursor-pointer">
//                                     <p className="text-gray-800 text-sm">{req.sender_username}</p>
//                                 </li>
//                             </Link>
//                         ))
//                     )}
//                 </ul>
//             )}
//         </div>
//     );
// }

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon, CheckIcon, XIcon } from "lucide-react";
import { type Incoming } from "@/models/Models";
import { tryCatch } from "@/utils/tryCatch";
import { api } from "@/lib/apiClient";

export default function IncomingRequestsSection({
    incoming,
    refetchIncoming,
}: {
    incoming: Incoming[];
    refetchIncoming: () => void;
}) {
    const [open, setOpen] = useState(false);

    const handleAccept = async (id: number) => {
        const { error } = await tryCatch(api.post(`/users/me/friends/incoming/${id}/accept`));
        if (error) {
            alert("Failed to accept friend request.");
        } else {
            refetchIncoming();
        }
    };

    const handleReject = async (id: number) => {
        const { error } = await tryCatch(api.delete(`/users/me/friends/incoming/${id}`));
        if (error) {
            alert("Failed to reject friend request.");
        } else {
            refetchIncoming();
        }
    };

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-row items-center text-xl font-bold mb-2"
            >
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />} Incoming Friend Requests
            </button>

            {open && (
                <ul>
                    {incoming.length === 0 ? (
                        <p className="text-gray-500 text-sm">No requests received.</p>
                    ) : (
                        incoming.map((req) => (
                            <li
                                key={req.id}
                                className="py-2 px-2 hover:bg-gray-50 rounded flex justify-between items-center"
                            >
                                <Link to={`/users/${req.sender_id}`}>
                                    <p className="text-gray-800 text-sm">{req.sender_username}</p>
                                </Link>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        className="text-green-600 hover:text-green-800"
                                        title="Accept"
                                    >
                                        <CheckIcon size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Reject"
                                    >
                                        <XIcon size={16} />
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}
