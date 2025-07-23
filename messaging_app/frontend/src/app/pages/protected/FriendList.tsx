import { useFetch } from "@/hooks/useFetch";
import FriendSection from "./FriendSection";
import AddFriendSection from "./AddFriendSection";
import IncomingRequestsSection from "./IncomingRequestsSection";
import { type Incoming, type Outgoing } from "@/models/Models";

export default function FriendList() {
    const { data: friendsData, loading: friendsLoading, error: friendsError } =
        useFetch<{ friends: { username: string; id: number }[] }>("/users/me/friends");

    const {
        data: incomingData,
        loading: incomingLoading,
        error: incomingError,
        refetch: refetchIncoming,
    } =
        useFetch<{ incoming: Incoming[] }>("/users/me/friends/incoming");

    const {
        data: outgoingData,
        loading: outgoingLoading,
        error: outgoingError,
        refetch: refetchOutgoing,
    } = useFetch<{ outgoing: Outgoing[] }>("/users/me/friends/outgoing");

    if (friendsLoading || incomingLoading || outgoingLoading)
        return <p className="p-4 text-gray-500">Loading...</p>;

    if (friendsError || incomingError || outgoingError)
        return <p className="p-4 text-red-500">Something went wrong...</p>;

    return (
        <div className="space-y-6">
            <FriendSection friends={friendsData?.friends || []} />
            <AddFriendSection
                refetchOutgoing={refetchOutgoing}
                outgoing={outgoingData?.outgoing || []}
            />
            <IncomingRequestsSection refetchIncoming={refetchIncoming} incoming={incomingData?.incoming || []} />
        </div>
    );
}
