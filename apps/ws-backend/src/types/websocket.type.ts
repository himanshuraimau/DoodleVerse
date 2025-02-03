
import { WebSocket } from 'ws';

export interface WebSocketConnection extends WebSocket {
    userId?: string;
}

export interface User{
    ws:WebSocket,
    rooms:string[],
    userId:string   
}