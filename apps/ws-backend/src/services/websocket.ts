import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { WebSocketConnection } from "../types/websocket";
import { checkUser } from "../utils/auth";

export class WebSocketService {
    private wss: WebSocketServer;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.init();
    }

    private init() {
        this.wss.on("connection", this.handleConnection.bind(this));
        console.log(`WebSocket server is running on ws://localhost:${this.wss.options.port}`);
    }

    private handleConnection(ws: WebSocketConnection, request: IncomingMessage) {
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

        ws.userId = userId;

        ws.on("message", (message) => {
            console.log(`Received message => ${message}`);
            ws.send(`Echo: ${message}`);
        });
    }
}
