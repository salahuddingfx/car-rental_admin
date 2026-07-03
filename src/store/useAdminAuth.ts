import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, authApi } from '../lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.login(email, password);
          if (user.role !== 'admin') {
            set({ isLoading: false, error: 'Access denied. Admin only.' });
            return false;
          }
          api.setToken(token);
          set({
            admin: {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      logout: () => {
        api.setToken(null);
        set({ admin: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = api.getToken();
        if (!token) {
          set({ admin: null, isAuthenticated: false });
          return;
        }
        try {
          const user = await authApi.me();
          if (user.role !== 'admin') {
            api.setToken(null);
            set({ admin: null, isAuthenticated: false });
            return;
          }
          set({
            admin: {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
            },
            isAuthenticated: true,
          });
        } catch {
          api.setToken(null);
          set({ admin: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'apexride-admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
