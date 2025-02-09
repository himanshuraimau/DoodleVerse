import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthStore } from '../types'


export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (token: string) => {
        localStorage.setItem('token', token);
        set({ isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
