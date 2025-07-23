// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { tryCatch } from "@/utils/tryCatch";
// import { api } from "@/lib/apiClient";
// import { Link } from "react-router-dom";
// import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
// import { type Outgoing } from "@/models/Models";
//
// type FormData = { username: string };
// type Errors = { username?: string };
//
// function useForm(onSuccess?: () => void) {
//     const { user } = useAuth();
//     const [form, setForm] = useState<FormData>({ username: "" });
//     const [errors, setErrors] = useState<Errors>({});
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };
//
//     const validate = () => {
//         const errs: Errors = {};
//         if (!form.username.trim()) {
//             errs.username = "Username is required";
//         }
//         return errs;
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const validationErrors = validate();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }
//
//         const { error } = await tryCatch(
//             api.post("/users/me/friends/outgoing", {
//                 sender_id: user?.id,
//                 receiver_id: parseInt(form.username),
//             })
//         );
//
//         if (error) {
//             alert("Friend request failed.");
//         } else {
//             setForm({ username: "" });
//             setErrors({});
//             onSuccess?.();
//         }
//     };
//
//     return { form, errors, handleChange, handleSubmit };
// }
//
// export default function AddFriendSection({
//     outgoing,
//     refetchOutgoing,
// }: {
//     outgoing: Outgoing[];
//     refetchOutgoing: () => void;
// }) {
//     const [open, setOpen] = useState(false);
//     const { form, errors, handleChange, handleSubmit } = useForm(refetchOutgoing);
//
//     return (
//         <div>
//             <button
//                 onClick={() => setOpen((prev) => !prev)}
//                 className="flex flex-row items-center text-xl font-bold mb-2"
//             >
//                 {open ? <ChevronDownIcon /> : <ChevronRightIcon />} Add Friends
//             </button>
//
//             {open && (
//                 <>
//                     <form
//                         onSubmit={handleSubmit}
//                         className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mt-2"
//                     >
//                         <div className="flex-1">
//                             <label className="block text-sm font-medium text-gray-700">Username</label>
//                             <input
//                                 name="username"
//                                 value={form.username}
//                                 onChange={handleChange}
//                                 className="mt-1 w-full border px-3 py-2 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                             />
//                             {errors.username && (
//                                 <p className="text-sm text-red-500 mt-1">{errors.username}</p>
//                             )}
//                         </div>
//                         <button
//                             type="submit"
//                             className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
//                         >
//                             Add
//                         </button>
//                     </form>
//
//                     <div className="mt-4">
//                         <p className="text-sm font-semibold text-gray-600">Pending Requests</p>
//                         <ul>
//                             {outgoing.length === 0 ? (
//                                 <p className="text-gray-500 text-sm">No pending requests.</p>
//                             ) : (
//                                 outgoing.map((o) => (
//                                     <Link key={o.id} to={`/users/${o.receiver_id}`}>
//                                         <li className="py-2 px-2 hover:bg-gray-50 rounded cursor-pointer">
//                                             <p className="text-gray-800 text-sm">{o.receiver_username}</p>
//                                         </li>
//                                     </Link>
//                                 ))
//                             )}
//                         </ul>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }


import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { tryCatch } from "@/utils/tryCatch";
import { api } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { type Outgoing } from "@/models/Models";

type FormData = { username: string };
type Errors = { username?: string };

function useForm(onSuccess?: () => void) {
    const { user } = useAuth();
    const [form, setForm] = useState<FormData>({ username: "" });
    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const errs: Errors = {};
        if (!form.username.trim()) {
            errs.username = "Username is required";
        }
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const { error } = await tryCatch(
            api.post("/users/me/friends/outgoing", {
                sender_id: user?.id,
                receiver_id: parseInt(form.username),
            })
        );

        if (error) {
            alert("Friend request failed.");
        } else {
            setForm({ username: "" });
            setErrors({});
            onSuccess?.();
        }
    };

    return { form, errors, handleChange, handleSubmit };
}

export default function AddFriendSection({
    outgoing,
    refetchOutgoing,
}: {
    outgoing: Outgoing[];
    refetchOutgoing: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { form, errors, handleChange, handleSubmit } = useForm(refetchOutgoing);

    // 🧠 Cancel function
    const handleCancel = async (id: number) => {
        const { error } = await tryCatch(
            api.delete(`/users/me/friends/outgoing/${id}`)
        );
        if (error) {
            alert("Failed to cancel request.");
        } else {
            refetchOutgoing();
        }
    };

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex flex-row items-center text-xl font-bold mb-2"
            >
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />} Add Friends
            </button>

            {open && (
                <>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mt-2"
                    >
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Add
                        </button>
                    </form>

                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600">Pending Requests</p>
                        <ul>
                            {outgoing.length === 0 ? (
                                <p className="text-gray-500 text-sm">No pending requests.</p>
                            ) : (
                                outgoing.map((o) => (
                                    <li
                                        key={o.id}
                                        className="py-2 px-2 hover:bg-gray-50 rounded flex items-center justify-between"
                                    >
                                        <Link to={`/users/${o.receiver_id}`}>
                                            <p className="text-gray-800 text-sm">
                                                {o.receiver_username}
                                            </p>
                                        </Link>
                                        <button
                                            onClick={() => handleCancel(o.id)}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                            title="Cancel Request"
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
