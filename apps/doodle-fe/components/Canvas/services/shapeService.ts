import axios from "axios";
import { HTTP_URL } from "@/config";
import { Shape } from "../types/shapes";

export async function getExistingShapes(roomId: string, token: string): Promise<Shape[]> {
    const res = await axios.get(`${HTTP_URL}/room/${roomId}/chats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const messages = res.data.messages;
    return messages.map((x: { message: string }) => JSON.parse(x.message));
}

export function sendShapeToWebSocket(socket: WebSocket, shape: Shape, roomId: string): void {
    if (socket.readyState === WebSocket.OPEN) {
        try {
            socket.send(JSON.stringify({
                type: 'chat',
                message: JSON.stringify(shape),
                roomId: roomId,
            }));
        } catch (error) {
            console.error('Error sending shape through WebSocket:', error);
        }
    } else {
        console.warn('WebSocket not ready');
    }
}
