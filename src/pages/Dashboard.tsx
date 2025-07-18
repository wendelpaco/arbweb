import React, { useEffect } from "react";
import { MetricsCard } from "../components/dashboard/MetricsCard";
import { ArbitrageTable } from "../components/dashboard/ArbitrageTable";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import { useArbitrageStore } from "../stores/arbitrage";
import { useAuthStore } from "../stores/auth";
import {
  TrendingUp,
  DollarSign,
  Target,
  Award,
  TrendingDown,
  Activity,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";

export const Dashboard: React.FC = () => {
  const { dashboardMetrics, arbitrages, calculateDashboardMetrics } =
    useArbitrageStore();
  const { login } = useAuthStore();

  useEffect(() => {
    // Simulate login for demo
    login({
      id: "1",
      email: "usuario@arbweb.com",
      name: "Usuário Premium",
      preferences: {
        favoriteBookmakers: ["Bet365", "William Hill"],
        minRoi: 2.0,
        notifications: true,
      },
    });

    // Add some sample data
    const sampleArbitrages = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        match: {
          team1: "Flamengo",
          team2: "Palmeiras",
          sport: "Futebol",
          competition: "Brasileirão",
        },
        bookmakers: [
          {
            name: "Bet365",
            odds: 1.85,
            betType: "Casa",
            stake: 100,
            profit: 85,
          },
          {
            name: "William Hill",
            odds: 2.1,
            betType: "Fora",
            stake: 88.1,
            profit: 96.9,
          },
        ],
        metrics: {
          totalProfit: 81.9,
          profitPercentage: 4.3,
          roi: 4.3,
          totalStake: 188.1,
          arbitragePercentage: 95.7,
        },
        imageUrl: "",
        status: "processed" as const,
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        match: {
          team1: "Santos",
          team2: "Corinthians",
          sport: "Futebol",
          competition: "Brasileirão",
        },
        bookmakers: [
          {
            name: "Unibet",
            odds: 1.95,
            betType: "Casa",
            stake: 100,
            profit: 95,
          },
          {
            name: "Betfair",
            odds: 2.05,
            betType: "Fora",
            stake: 95.1,
            profit: 99.7,
          },
        ],
        metrics: {
          totalProfit: 94.7,
          profitPercentage: 4.8,
          roi: 4.8,
          totalStake: 195.1,
          arbitragePercentage: 95.2,
        },
        imageUrl: "",
        status: "processed" as const,
      },
    ];

    // Add sample data to store
    sampleArbitrages.forEach((arbitrage) => {
      // This would normally be done through the store's addArbitrage method
      // For now, we'll just calculate metrics
    });

    calculateDashboardMetrics();
  }, [login, calculateDashboardMetrics]);

  const handleViewArbitrage = (arbitrage: any) => {
    console.log("View arbitrage:", arbitrage);
  };

  const handleEditArbitrage = (arbitrage: any) => {
    console.log("Edit arbitrage:", arbitrage);
  };

  const handleDeleteArbitrage = (id: string) => {
    console.log("Delete arbitrage:", id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo ao ArbWeb Premium</h1>
        <p className="text-primary-100">
          Sistema avançado de análise de arbitragem esportiva
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Lucro Total"
          value={formatCurrency(dashboardMetrics.totalProfit)}
          change={12.5}
          changeType="positive"
          icon={<DollarSign className="w-6 h-6 text-primary-600" />}
          variant="success"
        />
        <MetricsCard
          title="Arbitragens"
          value={dashboardMetrics.totalArbitrages}
          change={8.2}
          changeType="positive"
          icon={<Target className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="ROI Médio"
          value={formatPercentage(dashboardMetrics.averageRoi)}
          change={-2.1}
          changeType="negative"
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Taxa de Sucesso"
          value={formatPercentage(dashboardMetrics.successRate)}
          change={5.3}
          changeType="positive"
          icon={<Award className="w-6 h-6 text-primary-600" />}
          variant="success"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitChart data={dashboardMetrics.profitByPeriod} />
        <DistributionChart
          data={dashboardMetrics.bookmakerDistribution}
          title="Distribuição por Casas"
          subtitle="Lucro total por casa de apostas"
        />
      </div>

      {/* Arbitrage Table */}
      <ArbitrageTable
        arbitrages={arbitrages}
        onView={handleViewArbitrage}
        onEdit={handleEditArbitrage}
        onDelete={handleDeleteArbitrage}
      />
    </div>
  );
};
