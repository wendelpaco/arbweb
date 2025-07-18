import { create } from "zustand";
import { AuthState } from "../types";

interface AuthStore extends AuthState {
  login: (user: AuthState["user"]) => void;
  logout: () => void;
  updatePreferences: (
    preferences: NonNullable<AuthState["user"]>["preferences"]
  ) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (user) => set({ isAuthenticated: true, user }),

  logout: () => set({ isAuthenticated: false, user: null }),

  updatePreferences: (preferences) =>
    set((state) => ({
      user: state.user ? { ...state.user, preferences } : null,
    })),
}));
