import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ArbitrageData, DashboardMetrics } from "../types";

function reviveArbitrages(arbitrages: ArbitrageData[]): ArbitrageData[] {
  return arbitrages.map((arb) => ({
    ...arb,
    timestamp: new Date(arb.timestamp),
  }));
}

interface ArbitrageState {
  arbitrages: ArbitrageData[];
  dashboardMetrics: DashboardMetrics;
  isLoading: boolean;
  error: string | null;

  // Actions
  addArbitrage: (arbitrage: ArbitrageData) => void;
  updateArbitrage: (id: string, updates: Partial<ArbitrageData>) => void;
  deleteArbitrage: (id: string) => void;
  setArbitrages: (arbitrages: ArbitrageData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  calculateDashboardMetrics: () => void;
  clearAllData: () => void;
}

export const useArbitrageStore = create<ArbitrageState>()(
  persist(
    (set, get) => ({
      arbitrages: [],
      dashboardMetrics: {
        totalProfit: 0,
        totalArbitrages: 0,
        averageRoi: 0,
        successRate: 0,
        bestBookmaker: "",
        mostProfitableSport: "",
        profitByPeriod: [],
        bookmakerDistribution: [],
        sportDistribution: [],
      },
      isLoading: false,
      error: null,

      addArbitrage: (arbitrage) => {
        set((state) => ({
          arbitrages: [arbitrage, ...state.arbitrages],
        }));
        get().calculateDashboardMetrics();
      },

      updateArbitrage: (id, updates) => {
        set((state) => ({
          arbitrages: state.arbitrages.map((arb) =>
            arb.id === id ? { ...arb, ...updates } : arb
          ),
        }));
        get().calculateDashboardMetrics();
      },

      deleteArbitrage: (id) => {
        set((state) => ({
          arbitrages: state.arbitrages.filter((arb) => arb.id !== id),
        }));
        get().calculateDashboardMetrics();
      },

      setArbitrages: (arbitrages) => {
        set({ arbitrages });
        get().calculateDashboardMetrics();
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearAllData: () => {
        set({
          arbitrages: [],
          dashboardMetrics: {
            totalProfit: 0,
            totalArbitrages: 0,
            averageRoi: 0,
            successRate: 0,
            bestBookmaker: "",
            mostProfitableSport: "",
            profitByPeriod: [],
            bookmakerDistribution: [],
            sportDistribution: [],
          },
          error: null,
        });
      },

      calculateDashboardMetrics: () => {
        const { arbitrages } = get();

        if (arbitrages.length === 0) {
          set({
            dashboardMetrics: {
              totalProfit: 0,
              totalArbitrages: 0,
              averageRoi: 0,
              successRate: 0,
              bestBookmaker: "",
              mostProfitableSport: "",
              profitByPeriod: [],
              bookmakerDistribution: [],
              sportDistribution: [],
            },
          });
          return;
        }

        // Calculate total profit
        const totalProfit = arbitrages.reduce(
          (sum, arb) => sum + arb.metrics.totalProfit,
          0
        );

        // Calculate average ROI
        const totalRoi = arbitrages.reduce(
          (sum, arb) => sum + arb.metrics.roi,
          0
        );
        const averageRoi = totalRoi / arbitrages.length;

        // Calculate success rate (arbitrages with positive profit)
        const successfulArbitrages = arbitrages.filter(
          (arb) => arb.metrics.totalProfit > 0
        );
        const successRate =
          (successfulArbitrages.length / arbitrages.length) * 100;

        // Find best bookmaker
        const bookmakerProfits: { [key: string]: number } = {};
        arbitrages.forEach((arb) => {
          arb.bookmakers.forEach((bm) => {
            bookmakerProfits[bm.name] =
              (bookmakerProfits[bm.name] || 0) + bm.profit;
          });
        });
        const bestBookmaker =
          Object.entries(bookmakerProfits).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0] || "";

        // Find most profitable sport
        const sportProfits: { [key: string]: number } = {};
        arbitrages.forEach((arb) => {
          sportProfits[arb.match.sport] =
            (sportProfits[arb.match.sport] || 0) + arb.metrics.totalProfit;
        });
        const mostProfitableSport =
          Object.entries(sportProfits).sort(([, a], [, b]) => b - a)[0]?.[0] ||
          "";

        // Calculate profit by period (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentArbitrages = arbitrages.filter(
          (arb) => arb.timestamp >= thirtyDaysAgo
        );

        const profitByPeriod = recentArbitrages.reduce((acc, arb) => {
          const date = arb.timestamp.toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + arb.metrics.totalProfit;
          return acc;
        }, {} as { [key: string]: number });

        const profitByPeriodArray = Object.entries(profitByPeriod).map(
          ([date, profit]) => ({
            date,
            profit,
          })
        );

        // Calculate bookmaker distribution
        const bookmakerDistribution = Object.entries(bookmakerProfits).map(
          ([name, totalProfit]) => ({
            name,
            count: arbitrages.filter((arb) =>
              arb.bookmakers.some((bm) => bm.name === name)
            ).length,
            totalProfit,
          })
        );

        // Calculate sport distribution
        const sportDistribution = Object.entries(sportProfits).map(
          ([sport, totalProfit]) => ({
            sport,
            count: arbitrages.filter((arb) => arb.match.sport === sport).length,
            totalProfit,
          })
        );

        set({
          dashboardMetrics: {
            totalProfit,
            totalArbitrages: arbitrages.length,
            averageRoi,
            successRate,
            bestBookmaker,
            mostProfitableSport,
            profitByPeriod: profitByPeriodArray,
            bookmakerDistribution,
            sportDistribution,
          },
        });
      },
    }),
    {
      name: "arbitrage-storage", // nome da chave no localStorage
      partialize: (state) => ({
        arbitrages: state.arbitrages,
        dashboardMetrics: state.dashboardMetrics,
      }),
      // Corrigir a hidratação do estado
      onRehydrateStorage: () => (state) => {
        if (state && state.arbitrages) {
          state.arbitrages = reviveArbitrages(state.arbitrages);
        }
      },
    }
  )
);
