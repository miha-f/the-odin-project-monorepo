import { useEffect, useRef, useState, useCallback } from "react";

interface UseChatWebSocketOptions {
    url: string;
    onMessage: (data: any) => void;
    onOpen?: () => void;
    onClose?: (event?: CloseEvent) => void;
    maxRetries?: number;
    retryInitialDelayMs?: number;
    retryMaxDelayMs?: number;
}

export function useChatWebSocket({
    url,
    onMessage,
    onOpen,
    onClose,
    maxRetries = 5,
    retryInitialDelayMs = 1000,
    retryMaxDelayMs = 30000,
}: UseChatWebSocketOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const retryCountRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isConnected, setIsConnected] = useState(false);

    const clearReconnectTimeout = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearReconnectTimeout();
            wsRef.current?.close();
        };
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            // Already connected or connecting
            return;
        }

        wsRef.current = new WebSocket(url);

        wsRef.current.onopen = () => {
            retryCountRef.current = 0;
            setIsConnected(true);
            onOpen?.();
            clearReconnectTimeout();
            console.log("✅ WebSocket connected");
        };

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (err) {
                console.error("⚠️ Failed to parse WS message", err);
            }
        };

        wsRef.current.onclose = (event) => {
            setIsConnected(false);
            onClose?.(event);
            console.warn(`🔌 WebSocket closed (code: ${event.code}).`);

            if (retryCountRef.current < maxRetries) {
                const delay = Math.min(
                    retryInitialDelayMs * 2 ** retryCountRef.current,
                    retryMaxDelayMs
                );
                console.log(`⏳ Reconnecting in ${delay}ms...`);
                reconnectTimeoutRef.current = setTimeout(() => {
                    retryCountRef.current++;
                    connect();
                }, delay);
            } else {
                console.error("🚫 Max WebSocket retry attempts reached. No more reconnects.");
            }
        };

        wsRef.current.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
            // Close socket to trigger onclose and reconnection
            wsRef.current?.close();
        };
    }, [url, onMessage, onOpen, onClose, maxRetries, retryInitialDelayMs, retryMaxDelayMs]);

    // Connect on mount and url change
    useEffect(() => {
        connect();

        // Cleanup reconnect on unmount or url change
        return () => clearReconnectTimeout();
    }, [connect]);

    const send = useCallback((data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        } else {
            console.warn("⚠️ Cannot send message, WebSocket is not open.");
        }
    }, []);

    return { send, isConnected };
}

