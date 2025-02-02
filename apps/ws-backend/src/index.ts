import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
    const url = request.url;

    if (!url) {
        return;
    }

    console.log(`New connection from ${url}`);

    const queryParam = new URLSearchParams(url.split("?")[1]);
    const token = queryParam.get("token");

    if (!token) {
        ws.send("Unauthorized");
        ws.close();
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        console.log(payload);
    } catch (error) {
        ws.send("Unauthorized");
        ws.close();
        return;
    }

    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
        ws.send(`Echo: ${message}`);
    });
});

console.log("WebSocket server is running on ws://localhost:8080");

