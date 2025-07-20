import React, { useEffect, useState } from "react";
// import { MetricCard } from "../components/dashboard/MetricsCard";
import { ArbitrageTable } from "../components/dashboard/ArbitrageTable";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import { useArbitrageStore } from "../stores/arbitrage";
import { useAuthStore } from "../stores/auth";
import { EditArbitrageModal } from "../components/ui/EditArbitrageModal";
import { validateAndCalculateArbitrage } from "../utils/calculations";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  DollarSign,
  // Target,
  Award,
  X,
  CheckCircle,
  TrendingUp,
  // Calendar,
  PieChart,
} from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  // formatProfit,
  formatROI,
} from "../utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/Toast";
// import { Sparkline } from "../components/charts/Sparkline";

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

    // Calcular novas métricas baseadas nos dados editados
    const bmsWithProfit = bookmakers.map((bm: any) => ({
      ...bm,
      profit: bm.stake * bm.odds,
    }));

    // Usar a função de validação de forma síncrona
    const validation = validateAndCalculateArbitrage(bmsWithProfit);

    // Atualizar arbitragem com novos dados e métricas recalculadas
    updateArbitrage(selectedArbitrage.id, {
      match,
      bookmakers: bmsWithProfit,
      metrics: validation.metrics,
    });

    setEditModalOpen(false);
    setToastMsg("Arbitragem editada com sucesso!");
    setShowToast(true);
  };

  return (
    <TooltipProvider>
      <ToastProvider>
        <section className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 py-2">
          <div className="w-full px-0 space-y-10">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Dashboard
            </h1>

            <Toast
              open={showToast}
              onOpenChange={setShowToast}
              className="bg-green-600 text-white rounded-xl shadow-lg flex items-center gap-3 px-6 py-4 animate-in fade-in-0 slide-in-from-top-6"
            >
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="font-medium">{toastMsg}</span>
              <ToastClose asChild>
                <button className="ml-auto p-1 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white">
                  <X className="w-4 h-4" />
                </button>
              </ToastClose>
            </Toast>
            <ToastViewport className="fixed top-6 right-6 z-[100]" />
            {/* Modal de confirmação de exclusão */}
            {confirmDeleteId && (
              <Dialog open={!!confirmDeleteId} onOpenChange={cancelDelete}>
                <DialogContent className="max-w-lg p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 animate-in fade-in-0 scale-in-95">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Confirmar exclusão
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                      Tem certeza que deseja excluir a arbitragem{" "}
                      <span className="font-semibold">{confirmDeleteName}</span>
                      ?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-8 flex gap-4 justify-end">
                    <Button
                      variant="destructive"
                      className="rounded-xl px-8 py-2 text-base font-medium"
                      onClick={confirmDelete}
                    >
                      Excluir
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl px-8 py-2 text-base font-medium"
                      onClick={cancelDelete}
                    >
                      Cancelar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {/* Cards de métricas premium - visual profissional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
              <Card className="rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 flex flex-col gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Lucro Total
                  </span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(dashboardMetrics.totalProfit)}
                </div>
              </Card>
              <Card className="rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 flex flex-col gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    ROI Médio
                  </span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatROI(dashboardMetrics.averageRoi)}
                </div>
              </Card>
              <Card className="rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 flex flex-col gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Arbitragens
                  </span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {dashboardMetrics.totalArbitrages}
                </div>
              </Card>
              <Card className="rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 flex flex-col gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="text-xs font-medium text-zinc-500">
                    Taxa de Sucesso
                  </span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPercentage(dashboardMetrics.successRate)}
                </div>
              </Card>
            </div>
            {/* Gráficos premium */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-10">
              <Card className="p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Lucro ao longo do tempo
                </h3>
                <div className="h-64 sm:h-80">
                  <ProfitChart data={dashboardMetrics.profitByPeriod} />
                </div>
              </Card>
              <Card className="p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Distribuição por Casas
                </h3>
                <div className="h-64 sm:h-80">
                  <DistributionChart
                    data={dashboardMetrics.bookmakerDistribution}
                    title="Distribuição por Casas"
                    subtitle="Lucro total por casa de apostas"
                  />
                </div>
              </Card>
            </div>
            {/* Tabela de Arbitragens */}
            <ArbitrageTable
              arbitrages={arbitrages}
              onView={handleViewArbitrage}
              onEdit={handleEditArbitrage}
              onDelete={handleDeleteArbitrage}
            />
            {/* Modal de edição */}
            {editModalOpen && (
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
            )}
            {/* Modal de visualização premium */}
            {viewModalOpen && selectedArbitrage && (
              <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 animate-in fade-in-0 scale-in-95">
                  <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Detalhes da Arbitragem
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
                      {selectedArbitrage.match?.team1} vs{" "}
                      {selectedArbitrage.match?.team2} —{" "}
                      {selectedArbitrage.match?.competition}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                    <div className="space-y-3">
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">
                          Esporte
                        </span>
                        <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                          {selectedArbitrage.match?.sport}
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">
                          Lucro Total
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {selectedArbitrage.metrics?.totalProfit !== undefined
                            ? formatCurrency(
                                selectedArbitrage.metrics.totalProfit
                              )
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">
                          Total Apostado
                        </span>
                        <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedArbitrage.metrics?.totalStake !== undefined
                            ? formatCurrency(
                                selectedArbitrage.metrics.totalStake
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">
                          Data
                        </span>
                        <span className="text-base text-zinc-900 dark:text-zinc-100">
                          {selectedArbitrage.timestamp
                            ? new Date(
                                selectedArbitrage.timestamp
                              ).toLocaleString("pt-BR")
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">
                          ROI
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {selectedArbitrage.metrics?.roi !== undefined
                            ? Number(selectedArbitrage.metrics.roi).toFixed(2) +
                              "%"
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-zinc-500 mb-1">
                          Percentual Arbitragem
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {selectedArbitrage.metrics?.arbitragePercentage !==
                          undefined
                            ? (
                                Number(
                                  selectedArbitrage.metrics.arbitragePercentage
                                ) - 100
                              ).toFixed(2) + "%"
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                    Casas de Apostas
                  </h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm rounded-xl overflow-hidden">
                      <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 z-10">
                        <tr className="text-zinc-600 dark:text-zinc-300">
                          <th className="px-4 py-2 text-left">Casa</th>
                          <th className="px-4 py-2 text-left">Odds</th>
                          <th className="px-4 py-2 text-left">Tipo</th>
                          <th className="px-4 py-2 text-left">Stake</th>
                          <th className="px-4 py-2 text-left">Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedArbitrage.bookmakers?.map(
                          (bm: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b last:border-b-0 border-zinc-100 dark:border-zinc-800"
                            >
                              <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                                {bm.name}
                              </td>
                              <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                                {Number(bm.odds).toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                                {bm.betType}
                              </td>
                              <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                                {Number(bm.stake).toLocaleString("pt-BR", {
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                                {Number(bm.profit).toLocaleString("pt-BR", {
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <DialogFooter className="mt-8 flex gap-4 justify-end">
                    <Button
                      variant="default"
                      className="rounded-xl px-8 py-2 text-base font-medium"
                      onClick={() => setViewModalOpen(false)}
                    >
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </section>
      </ToastProvider>
    </TooltipProvider>
  );
};
