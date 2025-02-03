import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { WebSocketConnection, User } from "../types/websocket.type";
import { checkUser } from "../utils/auth";
import { prismaClient } from "@repo/db/client"

export class WebSocketService {
    private wss: WebSocketServer;
    users: User[] = [];

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.init();
    }

    private init() {
        this.wss.on("connection", this.handleConnection.bind(this));
        console.log(`WebSocket server is running on ws://localhost:${this.wss.options.port}`);
    }

    public handleConnection(ws: WebSocketConnection, request: IncomingMessage) {
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

        this.users.push({ ws, rooms: [], userId });
        ws.userId = userId;

        ws.on("message", (message) => {
            const parsedMessage = JSON.parse(message.toString());
            this.handleMessage(parsedMessage, userId);
        });
    }

    private handleMessage(parsedMessage: any, userId: string) {
        const user = this.users.find(user => user.userId === userId);
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
                this.broadcastMessage(user, parsedMessage.message,parsedMessage.roomId);
                break;
        }
    }

    private async broadcastMessage(user: User, message: string, roomId: string) {
        await prismaClient.chat.create({
            data: {
                message,
                userId: user.userId,
                roomId: Number(roomId)
            }
        });
        user.rooms.forEach(room => {
            this.users.forEach(u => {
                if (u.rooms.includes(room)) {
                    u.ws.send(JSON.stringify({ type: "chat", message }));
                }
            });
        });
    }
}
