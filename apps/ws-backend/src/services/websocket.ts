import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { WebSocketConnection, User } from "../types/websocket.type";
import { checkUser } from "../utils/auth";
import { prismaClient } from "@repo/db/client"

export function startWebSocketServer(port: number) {
    const wss = new WebSocketServer({ port });
    const users: User[] = [];

    function handleConnection(ws: WebSocketConnection, request: IncomingMessage) {
        const url = request.url;
        if (!url) {
            return;
        }

        console.log(`New connection from ${url}`);

        const queryParam = new URLSearchParams(url.split("?")[1]);
        const userToken = queryParam.get("token");
        const userId = checkUser(userToken || "");

        if (!userId) {
            console.log("Invalid token");
            ws.close();
            return;
        }

        users.push({ ws, rooms: [], userId });
        ws.userId = userId;

        ws.on("message", (message) => {
            console.log("Received message:", message.toString());
            const parsedMessage = JSON.parse(message.toString());
            handleMessage(parsedMessage, userId);
        });
    }

    function handleMessage(parsedMessage: any, userId: string) {
        const user = users.find(u => u.userId === userId);
        if (!user) return;

        switch (parsedMessage.type) {
            case "join_room":
                if (!user.rooms.includes(parsedMessage.roomId)) {
                    user.rooms.push(parsedMessage.roomId);
                }
                break;
            case "leave_room":
                user.rooms = user.rooms.filter(room => room !== parsedMessage.roomId);
                break;
            case "chat":
                broadcastMessage(user, parsedMessage.message, parsedMessage.roomId);
                break;
        }
    }

    async function broadcastMessage(user: User, message: string, roomId: string) {
        try {
            const chatMessage = await prismaClient.chat.create({
                data: {
                    message,
                    userId: user.userId,
                    roomId: Number(roomId)
                }
            });

            // Prepare complete message data with proper date handling
            const messageToSend = {
                type: "chat",
                id: chatMessage.id,
                message: message,
                userId: user.userId,
                roomId: Number(roomId),
                created: chatMessage.createdAt
            };

            // Send to all users in the room including sender
            const usersInRoom = users.filter(u => u.rooms.includes(roomId));
            usersInRoom.forEach(u => {
                if (u.ws.readyState === u.ws.OPEN) {
                    u.ws.send(JSON.stringify({
                        ...messageToSend,
                        isCurrentUser: u.userId === user.userId
                    }));
                }
            });
        } catch (error) {
            console.error("Error broadcasting message:", error);
        }
    }

    wss.on("connection", handleConnection);
    console.log(`WebSocket server is running on ws://localhost:${wss.options.port}`);
}
