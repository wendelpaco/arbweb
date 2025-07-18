import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UIState } from "../types";

type UIStore = UIState & {
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  setFilters: (filters: Partial<UIState["selectedFilters"]>) => void;
  resetFilters: () => void;
  setDebugOcr: (value: boolean) => void;
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
      debugOcr: false,
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
      setDebugOcr: (value) => set({ debugOcr: value }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        selectedFilters: state.selectedFilters,
        debugOcr: state.debugOcr,
      }),
    }
  )
);
