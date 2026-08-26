// frontend/src/store/useAuthStore.ts
import { create } from 'zustand';
import { useCartStore } from './useCartStore';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any, token: string, refreshToken: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (user, token, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ isAuthenticated: true, user });
    useCartStore.getState().fetchCart();
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    set({ isAuthenticated: false, user: null });
    // Calling clearCart after isAuthenticated=false will just clear local state, which is correct
    useCartStore.getState().clearCart();
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          set({ isAuthenticated: true, user });
          useCartStore.getState().fetchCart();
        } catch (e) {
          set({ isAuthenticated: false, user: null });
        }
      }
    }
  },
}));
