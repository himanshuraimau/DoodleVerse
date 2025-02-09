import { create } from 'zustand';
import { Message } from '../types';

interface SocketState {
    socket: WebSocket | null;
    messages: Message[];
    isConnecting: boolean;
    error: string | null;
    currentUserId: string | null;
    connect: (token: string) => void;
    disconnect: () => void;
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    setCurrentUserId: (userId: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    messages: [],
    isConnecting: false,
    error: null,
    currentUserId: null,
    connect: (token: string) => {
        if (get().socket) return;

        set({ isConnecting: true, error: null });

        try {
            const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

            ws.onopen = () => {
                console.log('WebSocket connected');
                set({ socket: ws, isConnecting: false, error: null });
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'chat') {
                        const chatMessage: Message = {
                            id: data.id,
                            message: data.message,
                            roomId: data.roomId,
                            userId: data.userId,
                            sender: data.userId,
                            isCurrentUser: data.userId === get().currentUserId,
                            createdAt: ''
                        };
                        get().addMessage(chatMessage);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket closed');
                set({ socket: null, isConnecting: false });
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                set({ error: 'Failed to connect to chat server', isConnecting: false });
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
            set({ error: 'Failed to establish connection', isConnecting: false });
        }
    },
    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    },
    addMessage: (message) => {
        set(state => {
           
            console.log('Adding message:', message);
            
          
            if (state.messages.some(m => m.id === message.id)) {
                return state;
            }
            
            return { 
                messages: [...state.messages, {
                    ...message,
                    isCurrentUser: message.userId === state.currentUserId
                }]
            };
        });
    },
    clearMessages: () => {
        set({ messages: [] });
    },
    setCurrentUserId: (userId: string) => set({ currentUserId: userId })
}));
