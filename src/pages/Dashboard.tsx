import React, { useEffect, useState } from "react";
import { MetricCard } from "../components/dashboard/MetricsCard";
// import { ArbitrageTable } from "../components/dashboard/ArbitrageTable";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import { useArbitrageStore } from "../stores/arbitrage";
import { useAuthStore } from "../stores/auth";
import { EditArbitrageModal } from "../components/ui/EditArbitrageModal";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastClose,
} from "../components/ui/toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  DollarSign,
  Target,
  Award,
  TrendingDown,
  ArrowUpRight,
  X,
  CheckCircle,
} from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatProfit,
  formatROI,
  formatRelativeTime,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
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
  const [searchTerm, setSearchTerm] = useState("");

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
    updateArbitrage(selectedArbitrage.id, { match, bookmakers });
    setEditModalOpen(false);
    setToastMsg("Arbitragem editada com sucesso!");
    setShowToast(true);
  };

  const filteredArbitrages = arbitrages.filter((arb: any) => {
    const term = searchTerm.toLowerCase();
    return (
      (arb.match?.team1 && arb.match.team1.toLowerCase().includes(term)) ||
      (arb.match?.team2 && arb.match.team2.toLowerCase().includes(term)) ||
      (arb.match?.sport && arb.match.sport.toLowerCase().includes(term)) ||
      (arb.match?.competition &&
        arb.match.competition.toLowerCase().includes(term)) ||
      (arb.bookmakers &&
        arb.bookmakers.some((bm: any) => bm.name.toLowerCase().includes(term)))
    );
  });

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
            {/* Cards de métricas premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <MetricCard
                title="Lucro Total"
                value={formatProfit(dashboardMetrics.totalProfit)}
                change={dashboardMetrics.totalProfit}
                icon={
                  <DollarSign
                    className={`w-6 h-6 ${
                      dashboardMetrics.totalProfit < 0
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                }
                tooltip="Lucro acumulado das arbitragens no período selecionado."
              />
              <MetricCard
                title="ROI Médio"
                value={formatROI(dashboardMetrics.averageRoi)}
                change={dashboardMetrics.averageRoi}
                icon={
                  <DollarSign
                    className={`w-6 h-6 ${
                      dashboardMetrics.averageRoi < 0
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  />
                }
                tooltip="Retorno médio sobre o investimento das arbitragens."
              />
              <MetricCard
                title="Arbitragens"
                value={dashboardMetrics.totalArbitrages}
                change={dashboardMetrics.totalArbitrages}
                icon={<Target className="w-6 h-6 text-purple-500" />}
                tooltip="Total de arbitragens processadas no período."
              />
              <MetricCard
                title="Taxa de Sucesso"
                value={formatPercentage(dashboardMetrics.successRate)}
                change={dashboardMetrics.successRate}
                icon={<Award className="w-6 h-6 text-yellow-500" />}
                tooltip="Percentual de arbitragens bem-sucedidas."
              />
            </div>
            {/* Gráficos premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Lucro ao longo do tempo
                </h3>
                <ProfitChart data={dashboardMetrics.profitByPeriod} />
              </Card>
              <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Distribuição por Casas
                </h3>
                <DistributionChart
                  data={dashboardMetrics.bookmakerDistribution}
                  title="Distribuição por Casas"
                  subtitle="Lucro total por casa de apostas"
                />
              </Card>
            </div>
            {/* Tabela premium */}
            <Card className="p-0 overflow-x-auto mt-4 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-between px-8 pt-8 pb-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Oportunidades de Arbitragem
                </h2>
                <div className="flex items-center gap-2">
                  <Label htmlFor="search-arbs" className="sr-only">
                    Buscar arbitragens
                  </Label>
                  <Input
                    id="search-arbs"
                    type="text"
                    placeholder="Buscar arbitragens..."
                    className="h-10 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="default"
                    size="lg"
                    className="transition-all shadow-premium rounded-xl flex items-center gap-2"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6h18M3 12h18M3 18h18"
                      />
                    </svg>
                    Filtros
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Data
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Partida
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Esporte
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Lucro
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        ROI
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Casas
                      </th>
                      {/* <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Status
                      </th> */}
                      <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredArbitrages.map((arb: any) => (
                      <tr
                        key={arb.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-zinc-700 dark:text-zinc-200">
                          {arb.timestamp
                            ? formatRelativeTime(new Date(arb.timestamp))
                            : "-"}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                          {arb.match?.team1} vs {arb.match?.team2}
                          <div className="text-xs text-zinc-500">
                            {arb.match?.competition}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs">
                            {arb.match?.sport}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            arb.metrics?.totalProfit < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {formatCurrency(arb.metrics?.totalProfit)}
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            arb.metrics?.roi < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {formatPercentage(arb.metrics?.roi)}
                        </td>
                        <td className="px-6 py-4">
                          {arb.bookmakers?.length} casas
                        </td>
                        {/* <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-semibold shadow-sm">
                            {arb.status}
                          </span>
                        </td> */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label="Ver"
                                  title="Ver"
                                  onClick={() => handleViewArbitrage(arb)}
                                  className="focus-visible:ring-2 focus-visible:ring-primary-500"
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Ver detalhes
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label="Editar"
                                  title="Editar"
                                  onClick={() => handleEditArbitrage(arb)}
                                  className="focus-visible:ring-2 focus-visible:ring-primary-500"
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 000-1.414l-4.586-4.586a1 1 0 00-1.414 0L3 15v6z"
                                    />
                                  </svg>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Editar arbitragem
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label="Excluir"
                                  title="Excluir"
                                  onClick={() =>
                                    handleDeleteArbitrage(
                                      arb.id,
                                      `${arb.match?.team1} vs ${arb.match?.team2}`
                                    )
                                  }
                                  className="focus-visible:ring-2 focus-visible:ring-primary-500"
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Excluir arbitragem
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
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
                <DialogContent className="max-w-2xl p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 animate-in fade-in-0 scale-in-95">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      Detalhes da Arbitragem
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                      {selectedArbitrage.match?.team1} vs{" "}
                      {selectedArbitrage.match?.team2} —{" "}
                      {selectedArbitrage.match?.competition}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
                          Status
                        </span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            selectedArbitrage.status === "processed"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : selectedArbitrage.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                              : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {selectedArbitrage.status}
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
                  <DialogClose asChild>
                    <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <X className="w-5 h-5" />
                      <span className="sr-only">Fechar</span>
                    </button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </section>
      </ToastProvider>
    </TooltipProvider>
  );
};
