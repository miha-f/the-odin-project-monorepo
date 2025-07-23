import { useState, useRef, useEffect } from "react";
import { useChatWebSocket } from "@/hooks/useChatWebsocket";
import { useAuth } from "@/context/AuthContext";

export default function ChatMessages() {
    const { getToken, user } = useAuth()

    const [messages, setMessages] = useState([
        { id: 1, sender: "me", text: "Hey! How's it going?" },
        { id: 2, sender: "other", text: "Pretty good, thanks! You?" },
        { id: 3, sender: "me", text: "Awesome! Working on the chat app now." },
        { id: 4, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 5, sender: "me", text: "Hey! How's it going?" },
        { id: 6, sender: "other", text: "Pretty good, thanks! You?" },
        { id: 7, sender: "me", text: "Awesome! Working on the chat app now." },
        { id: 8, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 9, sender: "me", text: "Hey! How's it going?" },
        { id: 10, sender: "other", text: "Pretty good, thanks! You?" },
        { id: 11, sender: "me", text: "Awesome! Working on the chat app now." },
        { id: 12, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 13, sender: "me", text: "Awesome! Working on the chat app now." },
        { id: 14, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 15, sender: "me", text: "Hey! How's it going?" },
        { id: 16, sender: "other", text: "Pretty good, thanks! You?" },
        { id: 17, sender: "me", text: "Awesome! Working on the chat app now." },
        { id: 18, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 19, sender: "me", text: "Hey! How's it going?" },
        { id: 20, sender: "other", text: "Pretty good, thanks! You?" },
        { id: 21, sender: "me", text: "Awesome! Working on the chat app now." },
        { id: 22, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 23, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 24, sender: "other", text: "Nice! Let me know if you need help." },
        { id: 25, sender: "other", text: "Nice! Let me know if you need help." },
    ]);

    const handleWsMessage = (data: any) => {
        // Assuming data has shape { text: string, sender?: string }
        if (!data.content) return;


        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, sender: data.sender_id === user?.id ? "me" : "other", text: data.content },
        ]);
    };

    const { send, isConnected } = useChatWebSocket({
        url: `ws://localhost:8081/ws?token=${getToken() || ""}&room_id=1615`,
        onMessage: handleWsMessage,
        onOpen: () => console.log("WebSocket connected!"),
        onClose: () => console.log("WebSocket disconnected!"),
    });


    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        const outgoing = { content: newMessage.trim() };
        send(outgoing);
        setNewMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isConnected) return <p>Connecting to ws</p>

    return (
        <div className="flex flex-col h-full w-full max-w-8xl mx-auto bg-white shadow rounded-xl">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg shadow text-sm break-words ${msg.sender === "me"
                                ? "bg-indigo-600 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                            style={{ maxWidth: "80%" }} // ensure bubble never exceeds 80% width
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <textarea
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="
                                w-full
                                flex-1
                                resize-none
                                rounded-lg
                                border border-gray-300
                                px-4 py-2
                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                                overflow-y-auto
                                max-h-32
                            "
                    />

                    <button
                        onClick={handleSend}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
