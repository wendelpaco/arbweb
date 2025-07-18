import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ArbitrageTable } from "../components/dashboard/ArbitrageTable";
import { useArbitrageStore } from "../stores/arbitrage";
import { ArbitrageData } from "../types";
import {
  Calendar,
  Filter,
  Download,
  Search,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
} from "../utils/formatters";

export const History: React.FC = () => {
  const { arbitrages } = useArbitrageStore();
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
    console.log("View arbitrage:", arbitrage);
  };

  const handleEditArbitrage = (arbitrage: ArbitrageData) => {
    console.log("Edit arbitrage:", arbitrage);
  };

  const handleDeleteArbitrage = (id: string) => {
    console.log("Delete arbitrage:", id);
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
          <p className="text-gray-600">Timeline completo de arbitragens</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exportar CSV
          </Button>
          <Button variant="outline" leftIcon={<FileText className="w-4 h-4" />}>
            Relatório PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="input-field"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Esporte
            </label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="input-field"
            >
              {sports.map((sport) => (
                <option key={sport.value} value={sport.value}>
                  {sport.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar arbitragens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lucro Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalProfit)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Arbitragens
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalArbitrages}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(averageRoi)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Timeline de Arbitragens
          </h3>
          <p className="text-sm text-gray-500">
            Histórico cronológico de todas as arbitragens
          </p>
        </div>

        <div className="space-y-4">
          {historicalData.map((arbitrage, index) => (
            <div
              key={arbitrage.id}
              className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {arbitrage.match.team1} vs {arbitrage.match.team2}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {arbitrage.match.competition} • {arbitrage.match.sport}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        arbitrage.metrics.totalProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(arbitrage.metrics.totalProfit)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(arbitrage.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>ROI: {formatPercentage(arbitrage.metrics.roi)}</span>
                  <span>•</span>
                  <span>{arbitrage.bookmakers.length} casas</span>
                  <span>•</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      arbitrage.status === "processed"
                        ? "bg-green-100 text-green-800"
                        : arbitrage.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewArbitrage(arbitrage)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabela Detalhada */}
      <ArbitrageTable
        arbitrages={historicalData}
        onView={handleViewArbitrage}
        onEdit={handleEditArbitrage}
        onDelete={handleDeleteArbitrage}
      />
    </div>
  );
};
