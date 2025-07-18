import React, { useEffect, useState } from "react";
import { MetricsCard } from "../components/dashboard/MetricsCard";
import { ArbitrageTable } from "../components/dashboard/ArbitrageTable";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import { useArbitrageStore } from "../stores/arbitrage";
import { useAuthStore } from "../stores/auth";
import { EditArbitrageModal } from "../components/ui/EditArbitrageModal";
import { Toast } from "../components/ui/Toast";
import {
  TrendingUp,
  DollarSign,
  Target,
  Award,
  TrendingDown,
  Activity,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const Dashboard: React.FC = () => {
  const {
    dashboardMetrics,
    arbitrages,
    calculateDashboardMetrics,
    updateArbitrage,
    deleteArbitrage,
  } = useArbitrageStore();
  const { login } = useAuthStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedArbitrage, setSelectedArbitrage] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

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

  React.useEffect(() => {
    if (!confirmDeleteId) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelDelete();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [confirmDeleteId]);

  // View Modal ESC handler
  React.useEffect(() => {
    if (!viewModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [viewModalOpen]);

  const handleViewArbitrage = (arbitrage: any) => {
    setSelectedArbitrage(arbitrage);
    setViewModalOpen(true);
  };

  const handleEditArbitrage = (arbitrage: any) => {
    setSelectedArbitrage(arbitrage);
    setEditModalOpen(true);
  };

  const handleDeleteArbitrage = (id: string, matchName?: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(matchName || "");
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteArbitrage(confirmDeleteId);
      setToastMsg("Arbitragem excluída com sucesso!");
      setShowToast(true);
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  };

  const handleEditSave = (match: any, bookmakers: any) => {
    if (!selectedArbitrage) return;
    updateArbitrage(selectedArbitrage.id, { match, bookmakers });
    setEditModalOpen(false);
    setToastMsg("Arbitragem editada com sucesso!");
    setShowToast(true);
  };

  return (
    <div className="p-6 space-y-6">
      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
      {/* Modal de confirmação de exclusão */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Card className="w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={cancelDelete}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Confirmar Exclusão
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Tem certeza que deseja excluir a arbitragem{" "}
              <span className="font-semibold">{confirmDeleteName}</span>? Esta
              ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelDelete}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Excluir
              </Button>
            </div>
          </Card>
        </div>
      )}
      {/* Modal de visualização de arbitragem */}
      {viewModalOpen && selectedArbitrage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <Card className="w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setViewModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Detalhes da Arbitragem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time 1
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.match?.team1}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time 2
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.match?.team2}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Esporte
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.match?.sport}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Competição
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.match?.competition}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.timestamp
                    ? new Date(selectedArbitrage.timestamp).toLocaleString(
                        "pt-BR"
                      )
                    : "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 capitalize">
                  {selectedArbitrage.status}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Casas de Apostas</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-2 py-1 text-left">Casa</th>
                    <th className="px-2 py-1 text-left">Odds</th>
                    <th className="px-2 py-1 text-left">Tipo</th>
                    <th className="px-2 py-1 text-left">Stake</th>
                    <th className="px-2 py-1 text-left">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedArbitrage.bookmakers?.map((bm: any, i: number) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="px-2 py-1">{bm.name}</td>
                      <td className="px-2 py-1">
                        {Number(bm.odds).toFixed(2)}
                      </td>
                      <td className="px-2 py-1">{bm.betType}</td>
                      <td className="px-2 py-1">
                        {Number(bm.stake).toLocaleString("pt-BR", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1">
                        {Number(bm.profit).toLocaleString("pt-BR", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ROI
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.metrics?.roi !== undefined
                    ? Number(selectedArbitrage.metrics.roi).toFixed(2) + "%"
                    : "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lucro Total
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.metrics?.totalProfit !== undefined
                    ? formatCurrency(selectedArbitrage.metrics.totalProfit)
                    : "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Percentual Arbitragem
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.metrics?.arbitragePercentage !== undefined
                    ? Number(
                        selectedArbitrage.metrics.arbitragePercentage
                      ).toFixed(2) + "%"
                    : "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Apostado
                </label>
                <div className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800">
                  {selectedArbitrage.metrics?.totalStake !== undefined
                    ? formatCurrency(selectedArbitrage.metrics.totalStake)
                    : "-"}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}
      <EditArbitrageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        match={
          selectedArbitrage?.match || {
            team1: "",
            team2: "",
            sport: "",
            competition: "",
          }
        }
        bookmakers={selectedArbitrage?.bookmakers || []}
        onSave={handleEditSave}
      />
      {/* (Opcional) Modal de detalhes pode ser implementado aqui */}
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
        onDelete={(id: string) => {
          const arb = arbitrages.find((a) => a.id === id);
          const matchName = arb
            ? `${arb.match?.team1 || ""} vs ${arb.match?.team2 || ""}`
            : "";
          handleDeleteArbitrage(id, matchName);
        }}
      />
    </div>
  );
};
