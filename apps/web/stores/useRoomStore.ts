import { create } from 'zustand'

interface Room {
  id: string;
  slug: string;
}

interface RoomStore {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
}))
