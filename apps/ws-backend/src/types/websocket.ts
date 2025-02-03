
import { WebSocket } from 'ws';

export interface WebSocketConnection extends WebSocket {
    userId?: string;
}