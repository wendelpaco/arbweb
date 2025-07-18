import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UIState } from "../types";

type UIStore = UIState & {
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setFilters: (filters: Partial<UIState["selectedFilters"]>) => void;
  resetFilters: () => void;
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      theme: "light",
      selectedFilters: {
        dateRange: { start: null, end: null },
        sport: "",
        bookmaker: "",
        minProfit: 0,
        minRoi: 0,
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setTheme: (theme) => set({ theme }),

      setFilters: (filters) =>
        set((state) => ({
          selectedFilters: { ...state.selectedFilters, ...filters },
        })),

      resetFilters: () =>
        set({
          selectedFilters: {
            dateRange: { start: null, end: null },
            sport: "",
            bookmaker: "",
            minProfit: 0,
            minRoi: 0,
          },
        }),
    }),
    {
      name: "ui-storage", // nome da chave no localStorage
      partialize: (state) => ({
        theme: state.theme,
        selectedFilters: state.selectedFilters,
      }),
    }
  )
);
