export interface Room {
  id: number;
  slug: string;
}

export interface Message {
  id?: number;
  message: string;
  userId?: string;
  timestamp?: string;
  username?: string;
}

export interface WebSocketMessage {
  type: 'join_room' | 'chat';
  message?: string;
  roomId: string | number;
  userId?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
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


