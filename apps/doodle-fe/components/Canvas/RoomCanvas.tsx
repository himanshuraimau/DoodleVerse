import { CanvasPage } from "@/components/Canvas/CanvasPage";
import { WS_URL } from "@/config";
import { useState, useEffect, useCallback } from "react";
import useToolStore from "@/store/useToolStore";

const CONNECTION_TIMEOUT = 15000;
const RETRY_DELAYS = [1000, 2000, 3000, 5000, 8000]; // Progressive retry delays

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    const connectWebSocket = useCallback((storedToken: string) => {
        setIsConnecting(true);
        
        const ws = new WebSocket(`${WS_URL}?token=${storedToken}`);
        let timeoutId: NodeJS.Timeout;

        const cleanup = () => {
            clearTimeout(timeoutId);
            ws.removeEventListener('open', handleOpen);
            ws.removeEventListener('close', handleClose);
            ws.removeEventListener('error', handleError);
        };

        const handleOpen = () => {
            console.log("WebSocket connection established");
            cleanup();
            setIsConnecting(false);
            setRetryCount(0);
            setSocket(ws);
            ws.send(JSON.stringify({
                type: 'join_room',
                roomId: roomId
            }));
        };

        const handleClose = () => {
            console.log("WebSocket connection closed");
            cleanup();
            setSocket(null);
            retryConnection(storedToken);
        };

        const handleError = (error: Event) => {
            console.error("WebSocket error:", error);
            cleanup();
            setSocket(null);
            retryConnection(storedToken);
        };

        // Set connection timeout
        timeoutId = setTimeout(() => {
            console.log("Connection timeout");
            ws.close();
            retryConnection(storedToken);
        }, CONNECTION_TIMEOUT);

        ws.addEventListener('open', handleOpen);
        ws.addEventListener('close', handleClose);
        ws.addEventListener('error', handleError);
    }, [roomId]);

    const retryConnection = useCallback((storedToken: string) => {
        if (retryCount >= RETRY_DELAYS.length) {
            setIsConnecting(false);
            console.error("Max retry attempts reached");
            return;
        }

        const delay = RETRY_DELAYS[retryCount];
        console.log(`Retrying connection in ${delay/1000} seconds... (${retryCount + 1}/${RETRY_DELAYS.length})`);

        setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connectWebSocket(storedToken);
        }, delay);
    }, [retryCount, connectWebSocket]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            console.error("No token found in local storage");
            setIsConnecting(false);
            return;
        }

        setToken(storedToken);
        connectWebSocket(storedToken);

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [connectWebSocket]);

    if (isConnecting) {
        return <div>Establishing connection...</div>;
    }

    if (!socket || !token) {
        return <div>Failed to connect. Please refresh the page.</div>;
    }

    return <CanvasPage roomId={roomId} socket={socket} token={token} />;
}