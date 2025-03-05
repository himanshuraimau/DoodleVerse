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
    const shapes = new Map<string, Shape>();
    
    // Process messages in chronological order
    messages.forEach((x: { message: string }) => {
        try {
            const data = JSON.parse(x.message);
            if (data.type === 'deletion') {
                shapes.delete(data.shapeId);
            } else if (data.id) {
                shapes.set(data.id, data);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    return Array.from(shapes.values());
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

export function sendEraseShapeToWebSocket(socket: WebSocket, shapeId: string, roomId: string): void {
    // send a message to the backend to erase the shape with the shape id 
    if(socket.readyState === WebSocket.OPEN){
        try{
            socket.send(JSON.stringify({
                type: 'erase',
                shapeId: shapeId,
                roomId: roomId
            }))
        }catch(error){
            console.error('Error sending shape through WebSocket:', error);
        }
    }else{  
        console.warn('WebSocket not ready');
    }
}
