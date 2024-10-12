import MMKVStorage from "@/utils/storage";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string) => void;
  logout: () => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: MMKVStorage.getItem("token"),
  refreshToken: MMKVStorage.getItem("refreshToken"),
  isAuthenticated: !!MMKVStorage.getItem("token"),
  setAuth: (token, refreshToken) => {
    MMKVStorage.setItem("token", token);
    MMKVStorage.setItem("refreshToken", refreshToken);
    set({ token, refreshToken, isAuthenticated: true });
  },
  logout: () => {
    MMKVStorage.clear();
    set({ token: null, refreshToken: null, isAuthenticated: false });
  },
  getToken: () => MMKVStorage.getItem("token"),
  getRefreshToken: () => MMKVStorage.getItem("refreshToken"),
}));

export const useAuth = () => useAuthStore();
