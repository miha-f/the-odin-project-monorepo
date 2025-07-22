import { useState, useRef, useEffect } from "react";
import { useChatWebSocket } from "@/hooks/useChatWebsocket";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";
import { tryCatch } from "@/utils/tryCatch";
import { useParams } from "react-router-dom";

type Message = {
    id: number;
    content: string;
    sender_id: number;
    created_at: string;
};

export default function Room() {
    const { roomId } = useParams();
    const { getToken, user } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await tryCatch<{ msg: { messages: Message[] } }>(
                api.get(`/rooms/${roomId}/messages`)
            );

            if (error) {
                setError("Failed to load messages");
            } else {
                setMessages(data?.msg.messages || []);
            }

            setLoadingMessages(false);
        };

        fetchMessages();
    }, [roomId]);

    const handleWsMessage = (data: any) => {
        if (!data.content) return;

        const incoming: Message = {
            id: data.id ?? Date.now(),
            content: data.content,
            sender_id: data.sender_id,
            created_at: data.created_at ?? new Date().toISOString(),
        };

        setMessages((prev) => [...prev, incoming]);
    };

    const { send, isConnected } = useChatWebSocket({
        // url: `ws://localhost:8081/ws?token=${getToken() || ""}&room_id=${roomId}`,
        url: `ws://localhost:30082/ws?token=${getToken() || ""}&room_id=${roomId}`,
        onMessage: handleWsMessage,
        onOpen: () => console.log("WebSocket connected!"),
        onClose: () => console.log("WebSocket disconnected!"),
        // disabled: loadingMessages,
    });

    const handleSend = () => {
        if (!newMessage.trim() || !isConnected) return;
        send({ content: newMessage.trim() });
        setNewMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (loadingMessages) return <p className="text-gray-500">Loading...</p>;

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white shadow rounded-xl">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="w-2/3 h-6 bg-gray-200 rounded animate-pulse"
                        ></div>
                    ))
                    : messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg shadow text-sm break-words ${msg.sender_id === user?.id
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                    }`}
                                style={{ maxWidth: "80%" }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <textarea
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isConnected
                                ? "Type a message..."
                                : "Connecting to the chat server..."
                        }
                        className="w-full flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto max-h-32 disabled:bg-gray-100"
                        disabled={!isConnected}
                    />

                    <button
                        onClick={handleSend}
                        disabled={!isConnected || !newMessage.trim()}
                        className={`${isConnected
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-400 cursor-not-allowed"
                            } text-white px-4 py-2 rounded-lg transition`}
                    >
                        {isConnected ? "Send" : "Connecting..."}
                    </button>
                </div>
            </div>
        </div>
    );
}
