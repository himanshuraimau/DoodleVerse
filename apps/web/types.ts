export interface Room {
  id: string;
  slug: string;
}
export interface RoomStore {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
}

export interface Message {
  isCurrentUser: boolean;
  sender: string;
  id?: number;
  message: string;
  createdAt: string; // ISO date string
  roomId: number;
  userId: string;
  isOptimistic?: boolean;
  formattedDate?: string; // Optional formatted date string
}

export interface WebSocketMessage {
  type: 'join_room' | 'chat';
  message?: string;
  roomId: string | number;
  userId?: string;
}

export interface AuthStore {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export interface AuthService {
  signup: (name: string, email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<{ token: string }>;
}

export interface ChatRoomClientProps {
  messages: Message[];
  id: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
}

export interface CreateRoomResponse {
  roomId: string | number;
  message?: string;
}

export interface CreateRoomRequest {
  name: string;
}


export interface ChatMessage {
  type: string;
  message: string;
  id: number;
  userId: string;
  roomId: number;
  createdAt: string;
  isCurrentUser: boolean;
}