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
        totalStaked: 0,
        profitToday: 0,
        profitWeek: 0,
        profitMonth: 0,
        stakedToday: 0,
        stakedWeek: 0,
        stakedMonth: 0,
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
            totalStaked: 0,
            profitToday: 0,
            profitWeek: 0,
            profitMonth: 0,
            stakedToday: 0,
            stakedWeek: 0,
            stakedMonth: 0,
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
              totalStaked: 0,
              profitToday: 0,
              profitWeek: 0,
              profitMonth: 0,
              stakedToday: 0,
              stakedWeek: 0,
              stakedMonth: 0,
            },
          });
          return;
        }

        // Calculate total profit
        const totalProfit = arbitrages.reduce(
          (sum, arb) => sum + (arb.metrics?.totalProfit ?? 0),
          0
        );

        // Calculate average ROI
        const totalRoi = arbitrages.reduce(
          (sum, arb) => sum + (arb.metrics?.roi ?? 0),
          0
        );
        const averageRoi =
          arbitrages.length > 0 ? totalRoi / arbitrages.length : 0;

        // Calculate success rate (arbitrages with positive profit)
        const successfulArbitrages = arbitrages.filter(
          (arb) => (arb.metrics?.totalProfit ?? 0) > 0
        );
        const successRate =
          arbitrages.length > 0
            ? (successfulArbitrages.length / arbitrages.length) * 100
            : 0;

        // Find best bookmaker
        const bookmakerProfits: { [key: string]: number } = {};
        arbitrages.forEach((arb) => {
          (arb.bookmakers ?? []).forEach((bm) => {
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
          if (arb.match && arb.match.sport) {
            sportProfits[arb.match.sport] =
              (sportProfits[arb.match.sport] || 0) +
              (arb.metrics?.totalProfit ?? 0);
          }
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
          acc[date] = (acc[date] || 0) + (arb.metrics?.totalProfit ?? 0);
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
              (arb.bookmakers ?? []).some((bm) => bm.name === name)
            ).length,
            totalProfit,
          })
        );

        // Calculate sport distribution
        const sportDistribution = Object.entries(sportProfits).map(
          ([sport, totalProfit]) => ({
            sport,
            count: arbitrages.filter(
              (arb) => arb.match && arb.match.sport === sport
            ).length,
            totalProfit,
          })
        );

        // Calcular valor total apostado
        const totalStaked = arbitrages.reduce(
          (sum, arb) => sum + (arb.metrics?.totalStake ?? 0),
          0
        );

        // Calcular lucro e valor apostado por dia, semana, mês
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let profitToday = 0,
          profitWeek = 0,
          profitMonth = 0;
        let stakedToday = 0,
          stakedWeek = 0,
          stakedMonth = 0;
        arbitrages.forEach((arb) => {
          const ts = new Date(arb.timestamp);
          if (ts >= startOfToday) {
            profitToday += arb.metrics?.totalProfit ?? 0;
            stakedToday += arb.metrics?.totalStake ?? 0;
          }
          if (ts >= startOfWeek) {
            profitWeek += arb.metrics?.totalProfit ?? 0;
            stakedWeek += arb.metrics?.totalStake ?? 0;
          }
          if (ts >= startOfMonth) {
            profitMonth += arb.metrics?.totalProfit ?? 0;
            stakedMonth += arb.metrics?.totalStake ?? 0;
          }
        });

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
            totalStaked,
            profitToday,
            profitWeek,
            profitMonth,
            stakedToday,
            stakedWeek,
            stakedMonth,
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
