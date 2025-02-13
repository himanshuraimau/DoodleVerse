import { CanvasPage } from "@/components/Canvas/CanvasPage";
import { WS_URL } from "@/config";
import { useState, useEffect } from "react";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ODk2MDA4NC01MWU4LTQ4ZmQtOTQzZS01MzEzNWE2NGQyNzkiLCJpYXQiOjE3MzkzNzg2NjMsImV4cCI6MTczOTQ2NTA2M30.vBM9e69_x5khYQ8QueTSD5Ue-WPHvAkNBvMy2tLkJyw`);

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

    if (!socket) {
        return <div>Loading...</div>
    }


    return (
        <CanvasPage roomId={roomId} socket={socket}/>
    )
}