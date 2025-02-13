import { CanvasPage } from "@/components/Canvas/CanvasPage";
import { WS_URL } from "@/config";
import { useState, useEffect } from "react";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            console.error("No token found in local storage");
            return; 
        }

        setToken(storedToken);
         
        

        const ws = new WebSocket(`${WS_URL}?token=${storedToken}`);

        ws.onopen = () => {
            console.log("WebSocket connection opened");
            setSocket(ws);
            ws.send(JSON.stringify({
                type: 'join_room',
                roomId: roomId
            }));
        };
        
        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };

    }, [roomId]);

    if (!socket || !token) {
        return <div>Loading...</div>
    }


    return (
        <CanvasPage roomId={roomId} socket={socket} token={token}/>
    )
}