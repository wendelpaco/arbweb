export interface Bookmaker {
  name: string;
  odds: number;
  betType: string;
  stake: number;
  profit: number;
}

export interface Match {
  team1: string;
  team2: string;
  sport: string;
  competition: string;
}

export interface Metrics {
  totalProfit: number;
  profitPercentage: number;
  roi: number;
  totalStake: number;
  arbitragePercentage: number;
}

export interface ArbitrageData {
  id: string;
  timestamp: Date;
  match: Match;
  bookmakers: Bookmaker[];
  metrics: Metrics;
  imageUrl: string;
  status: "processed" | "pending" | "error";
}

export interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  selectedFilters: {
    dateRange: { start: Date | null; end: Date | null };
    sport: string;
    bookmaker: string;
    minProfit: number;
    minRoi: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    preferences: {
      favoriteBookmakers: string[];
      minRoi: number;
      notifications: boolean;
    };
  } | null;
}

export interface DashboardMetrics {
  totalProfit: number;
  totalArbitrages: number;
  averageRoi: number;
  successRate: number;
  bestBookmaker: string;
  mostProfitableSport: string;
  profitByPeriod: {
    date: string;
    profit: number;
  }[];
  bookmakerDistribution: {
    name: string;
    count: number;
    totalProfit: number;
  }[];
  sportDistribution: {
    sport: string;
    count: number;
    totalProfit: number;
  }[];
}
