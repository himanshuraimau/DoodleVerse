import { create } from 'zustand'
import { RoomStore } from '../types'

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
}))
