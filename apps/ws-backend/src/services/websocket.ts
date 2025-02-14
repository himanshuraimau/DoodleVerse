import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { checkUser } from "../utils/auth";
import { WebSocketConnection, User } from "../types/websocket.type";
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
        const token = queryParam.get("token") || "";
        const userId = checkUser(token);

        if (userId === null) {
            console.log("Invalid token");
            ws.close();
            return;
        }

        users.push({ ws, rooms: [], userId });

        ws.on("message", async (data) => {
            let parsedData;
            if (typeof data !== "string") {
                parsedData = JSON.parse(data.toString());
            } else {
                parsedData = JSON.parse(data);
            }
            
            console.log("Received message:", parsedData);
            handleMessage(parsedData, ws, userId);
        });

        ws.on("close", () => {
            const index = users.findIndex(u => u.ws === ws);
            if (index !== -1) {
                users.splice(index, 1);
            }
        });
    }

    async function handleMessage(parsedData: any, ws: WebSocketConnection, userId: string) {
        const user = users.find(u => u.ws === ws);
        if (!user) return;

        switch (parsedData.type) {
            case "join_room":
                if (!user.rooms.includes(parsedData.roomId)) {
                    user.rooms.push(parsedData.roomId);
                }
                break;

            case "leave_room":
                user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
                break;

            case "chat":
                try {
                    const roomId = parsedData.roomId;
                    const message = parsedData.message;

                    const chatMessage = await prismaClient.chat.create({
                        data: {
                            roomId: Number(roomId),
                            message,
                            userId
                        }
                    });

                    // Broadcast to all users in the room
                    users.forEach(u => {
                        if (u.rooms.includes(roomId) && u.ws.readyState === u.ws.OPEN) {
                            u.ws.send(JSON.stringify({
                                type: "chat",
                                id: chatMessage.id,
                                message: message,
                                userId: userId,
                                roomId: Number(roomId),
                                created: chatMessage.createdAt,
                                isCurrentUser: u.userId === userId
                            }));
                        }
                    });
                } catch (error) {
                    console.error("Error handling chat message:", error);
                }
                break;
        }
    }

    wss.on("connection", handleConnection);
    console.log(`WebSocket server is running on ws://localhost:${port}`);

    // Cleanup disconnected users periodically
    setInterval(() => {
        users.forEach((user, index) => {
            if (user.ws.readyState === user.ws.CLOSED) {
                users.splice(index, 1);
            }
        });
    }, 30000);
}