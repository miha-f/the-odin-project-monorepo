import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";
import { tryCatch } from "@/utils/tryCatch";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";

type Friend = {
    username: string,
    id: number,
}

type Incoming = {
    id: number,
    sender_id: number,
    receiver_id: number,
    status: string,
    created_at: string,
    responded_at: string,
}

type Outgoing = {
    id: number,
    sender_id: number,
    receiver_id: number,
    status: string,
    created_at: string,
    responded_at: string,
}

type FormData = {
    username: string;
};

type Errors = {
    username?: string;
};

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
            alert("Friend request failed. Please try again.");
        } else {
            setForm({ username: "" });
            setErrors({});
            onSuccess?.();
        }
    };

    return {
        form,
        errors,
        handleChange,
        handleSubmit,
    };
}

export default function FriendList() {
    const { data: friendsData, loading: friendsLoading, error: friendsError }
        = useFetch<{ friends: Friend[] }>("/users/me/friends");
    const friends = friendsData?.friends || [];

    const { data: incomingData, loading: incomingLoading, error: incomingError }
        = useFetch<{ incoming: Incoming[] }>("/users/me/friends/incoming");
    const incoming = incomingData?.incoming || [];

    const { data: outgoingData, loading: outgoingLoading, error: outgoingError, refetch: refetchOutgoing }
        = useFetch<{ outgoing: Outgoing[] }>("/users/me/friends/outgoing");
    const outgoing = outgoingData?.outgoing || [];

    const { form, errors, handleChange, handleSubmit } = useForm(() => refetchOutgoing());

    if (friendsError || incomingError || outgoingError)
        return <p className="text-red-500 p-4">Something went wrong...</p>;
    if (friendsLoading || incomingLoading || outgoingLoading)
        return <p className="text-gray-500 p-4">Loading...</p>;

    console.log(incoming);

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
            <h2 className="text-xl font-bold my-4">Add friends</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mt-2">
                <div className="flex-1">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={form.username}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        placeholder="Enter user ID or username"
                    />
                    {errors.username && (
                        <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
                >
                    Add
                </button>
            </form>

            {outgoing.length === 0 ?
                (
                    <p>No requests sent</p>
                )
                : (outgoing.map((outgoing) => (
                    <Link
                        key={outgoing.id}
                        to={`/users/${outgoing.id}`}
                    >
                        <li
                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition rounded cursor-pointer"
                        >
                            <p className="text-lg font-medium text-gray-800">{outgoing.receiver_id}</p>
                        </li>
                    </Link>
                )))}

            <h2 className="text-xl font-bold my-4">Accept friends</h2>
            {incoming.length === 0 ?
                (
                    <p>No requests received</p>
                )
                : (incoming.map((incoming) => (
                    <Link
                        key={incoming.id}
                        to={`/users/${incoming.id}`}
                    >
                        <li
                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition rounded cursor-pointer"
                        >
                            <p className="text-lg font-medium text-gray-800">{incoming.sender_id}</p>
                        </li>
                    </Link>
                )))}
        </div >
    );
}
