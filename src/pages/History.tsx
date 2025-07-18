import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArbitrageTable } from "../components/dashboard/ArbitrageTable";
// import { useArbitrageStore } from "../stores/arbitrage";
import { ArbitrageData } from "../types";
import { Search, Eye, X, CheckCircle } from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
} from "../utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastClose,
} from "../components/ui/Toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../components/ui/tooltip";

export const History: React.FC = () => {
  // const { arbitrages } = useArbitrageStore();
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedArbitrage, setSelectedArbitrage] =
    useState<ArbitrageData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Dados simulados para histórico
  const historicalData: ArbitrageData[] = [
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
        { name: "Bet365", odds: 1.85, betType: "Casa", stake: 100, profit: 85 },
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
      status: "processed",
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
        { name: "Unibet", odds: 1.95, betType: "Casa", stake: 100, profit: 95 },
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
      status: "processed",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      match: {
        team1: "Lakers",
        team2: "Warriors",
        sport: "Basquete",
        competition: "NBA",
      },
      bookmakers: [
        { name: "Bet365", odds: 1.75, betType: "Casa", stake: 100, profit: 75 },
        {
          name: "William Hill",
          odds: 2.25,
          betType: "Fora",
          stake: 77.8,
          profit: 87.5,
        },
      ],
      metrics: {
        totalProfit: 62.5,
        profitPercentage: 3.5,
        roi: 3.5,
        totalStake: 177.8,
        arbitragePercentage: 96.5,
      },
      imageUrl: "",
      status: "processed",
    },
  ];

  const dateRanges = [
    { value: "all", label: "Todo período" },
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 90 dias" },
  ];

  const sports = [
    { value: "all", label: "Todos os esportes" },
    { value: "futebol", label: "Futebol" },
    { value: "basquete", label: "Basquete" },
    { value: "tenis", label: "Tênis" },
    { value: "volei", label: "Vôlei" },
  ];

  const statuses = [
    { value: "all", label: "Todos os status" },
    { value: "processed", label: "Processado" },
    { value: "pending", label: "Processando" },
    { value: "error", label: "Erro" },
  ];

  const handleViewArbitrage = (arbitrage: ArbitrageData) => {
    setSelectedArbitrage(arbitrage);
    setViewModalOpen(true);
  };

  const handleEditArbitrage = (arbitrage: ArbitrageData) => {
    console.log(arbitrage);
    setToastMsg("Função de edição em breve!");
    setShowToast(true);
  };

  const handleDeleteArbitrage = (id: string) => {
    console.log(id);
    setToastMsg("Função de exclusão em breve!");
    setShowToast(true);
  };

  const totalProfit = historicalData.reduce(
    (sum, arb) => sum + arb.metrics.totalProfit,
    0
  );
  const totalArbitrages = historicalData.length;
  const averageRoi =
    historicalData.reduce((sum, arb) => sum + arb.metrics.roi, 0) /
    totalArbitrages;

  return (
    <TooltipProvider>
      <ToastProvider>
        <section className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 py-2">
          <div className="max-w-screen-xl mx-auto px-4 space-y-10">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Histórico
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
            {/* Filtros */}
            <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div className="flex flex-col gap-2 md:flex-row md:gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                      Período
                    </label>
                    <select
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                      className="h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      {dateRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                      Esporte
                    </label>
                    <select
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      {sports.map((sport) => (
                        <option key={sport.value} value={sport.value}>
                          {sport.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-64">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        placeholder="Buscar arbitragens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline">Exportar CSV</Button>
                  <Button variant="outline">Relatório PDF</Button>
                </div>
              </div>
            </Card>
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <Card className="p-6 flex flex-col gap-2 bg-white dark:bg-zinc-900">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Lucro Total
                </span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(totalProfit)}
                </span>
              </Card>
              <Card className="p-6 flex flex-col gap-2 bg-white dark:bg-zinc-900">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Total de Arbitragens
                </span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {totalArbitrages}
                </span>
              </Card>
              <Card className="p-6 flex flex-col gap-2 bg-white dark:bg-zinc-900">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  ROI Médio
                </span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPercentage(averageRoi)}
                </span>
              </Card>
            </div>
            {/* Timeline modernizada */}
            <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Timeline de Arbitragens
                </h3>
                <p className="text-sm text-zinc-500">
                  Histórico cronológico de todas as arbitragens
                </p>
              </div>
              <div className="space-y-4">
                {historicalData.map((arbitrage, index) => (
                  <div
                    key={arbitrage.id}
                    className="flex items-start space-x-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-300 font-medium text-sm">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                            {arbitrage.match.team1} vs {arbitrage.match.team2}
                          </h4>
                          <p className="text-sm text-zinc-500">
                            {arbitrage.match.competition} •{" "}
                            {arbitrage.match.sport}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              arbitrage.metrics.totalProfit >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatCurrency(arbitrage.metrics.totalProfit)}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {formatDate(arbitrage.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <span>
                          ROI: {formatPercentage(arbitrage.metrics.roi)}
                        </span>
                        <span>•</span>
                        <span>{arbitrage.bookmakers.length} casas</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            arbitrage.status === "processed"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                              : arbitrage.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                              : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {arbitrage.status === "processed"
                            ? "Processado"
                            : arbitrage.status === "pending"
                            ? "Processando"
                            : "Erro"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewArbitrage(arbitrage)}
                            className="focus-visible:ring-2 focus-visible:ring-primary-500"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Ver detalhes</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            {/* Tabela detalhada */}
            <ArbitrageTable
              arbitrages={historicalData}
              onView={handleViewArbitrage}
              onEdit={handleEditArbitrage}
              onDelete={handleDeleteArbitrage}
            />
            {/* Modal de visualização detalhada */}
            {viewModalOpen && selectedArbitrage && (
              <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <DialogContent className="max-w-2xl p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 animate-in fade-in-0 scale-in-95">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Detalhes da Arbitragem
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                      {selectedArbitrage.match?.team1} vs{" "}
                      {selectedArbitrage.match?.team2} —{" "}
                      {selectedArbitrage.match?.competition}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <span className="block text-xs text-zinc-500 mb-1">
                        Esporte
                      </span>
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        {selectedArbitrage.match?.sport}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-zinc-500 mb-1">
                        Data
                      </span>
                      <span className="text-sm text-zinc-900 dark:text-zinc-100">
                        {selectedArbitrage.timestamp
                          ? formatDate(selectedArbitrage.timestamp)
                          : "-"}
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
                        ROI
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {selectedArbitrage.metrics?.roi !== undefined
                          ? Number(selectedArbitrage.metrics.roi).toFixed(2) +
                            "%"
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-zinc-500 mb-1">
                        Lucro Total
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {selectedArbitrage.metrics?.totalProfit !== undefined
                          ? formatCurrency(
                              selectedArbitrage.metrics.totalProfit
                            )
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-zinc-500 mb-1">
                        Percentual Arbitragem
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {selectedArbitrage.metrics?.arbitragePercentage !==
                        undefined
                          ? Number(
                              selectedArbitrage.metrics.arbitragePercentage
                            ).toFixed(2) + "%"
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-zinc-500 mb-1">
                        Total Apostado
                      </span>
                      <span className="text-sm font-medium">
                        {selectedArbitrage.metrics?.totalStake !== undefined
                          ? formatCurrency(selectedArbitrage.metrics.totalStake)
                          : "-"}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Casas de Apostas
                  </h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm rounded-xl overflow-hidden">
                      <thead className="bg-zinc-100 dark:bg-zinc-800">
                        <tr className="text-zinc-600">
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
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="px-4 py-2">{bm.name}</td>
                              <td className="px-4 py-2">
                                {Number(bm.odds).toFixed(2)}
                              </td>
                              <td className="px-4 py-2">{bm.betType}</td>
                              <td className="px-4 py-2">
                                {Number(bm.stake).toLocaleString("pt-BR", {
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-2">
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
                  <DialogFooter className="mt-8 flex gap-4">
                    <Button
                      variant="outline"
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
