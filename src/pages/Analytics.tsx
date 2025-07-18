import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MetricsCard } from "../components/dashboard/MetricsCard";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import { useArbitrageStore } from "../stores/arbitrage";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";

export const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedSport, setSelectedSport] = useState("all");

  const periods = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "90 dias" },
    { value: "1y", label: "1 ano" },
  ];

  const sports = [
    { value: "all", label: "Todos os esportes" },
    { value: "futebol", label: "Futebol" },
    { value: "basquete", label: "Basquete" },
    { value: "tenis", label: "Tênis" },
    { value: "volei", label: "Vôlei" },
  ];

  // Dados simulados para gráficos
  const profitData = [
    { date: "2024-01-01", profit: 150 },
    { date: "2024-01-02", profit: 230 },
    { date: "2024-01-03", profit: 180 },
    { date: "2024-01-04", profit: 320 },
    { date: "2024-01-05", profit: 280 },
    { date: "2024-01-06", profit: 450 },
    { date: "2024-01-07", profit: 380 },
  ];

  const bookmakerData = [
    { name: "Bet365", count: 45, totalProfit: 1250 },
    { name: "William Hill", count: 32, totalProfit: 890 },
    { name: "Unibet", count: 28, totalProfit: 720 },
    { name: "Betfair", count: 22, totalProfit: 580 },
    { name: "Pinnacle", count: 18, totalProfit: 420 },
  ];

  const sportData = [
    { name: "Futebol", count: 65, totalProfit: 1850 },
    { name: "Basquete", count: 28, totalProfit: 720 },
    { name: "Tênis", count: 22, totalProfit: 580 },
    { name: "Vôlei", count: 15, totalProfit: 320 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Análise detalhada de performance e métricas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Atualizar
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
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
              ROI Mínimo
            </label>
            <Input type="number" placeholder="0.5" className="input-field" />
          </div>
        </div>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Lucro Total"
          value={formatCurrency(2850)}
          change={12.5}
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
          variant="success"
        />
        <MetricsCard
          title="Arbitragens"
          value="125"
          change={8.2}
          changeType="positive"
          icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="ROI Médio"
          value={formatPercentage(4.8)}
          change={-2.1}
          changeType="negative"
          icon={<TrendingDown className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Taxa de Sucesso"
          value={formatPercentage(87.5)}
          change={5.3}
          changeType="positive"
          icon={<PieChart className="w-6 h-6 text-primary-600" />}
          variant="success"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitChart data={profitData} />
        <DistributionChart
          data={bookmakerData}
          title="Distribuição por Casas"
          subtitle="Lucro total por casa de apostas"
        />
      </div>

      {/* Gráficos Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart
          data={sportData}
          title="Distribuição por Esportes"
          subtitle="Lucro total por esporte"
        />
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tendências</h3>
            <p className="text-sm text-gray-500">
              Análise de tendências ao longo do tempo
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Tendência Positiva</p>
                <p className="text-sm text-green-600">
                  ROI aumentando 2.3% por semana
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Volume Estável</p>
                <p className="text-sm text-blue-600">
                  Média de 4.2 arbitragens por dia
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-800">Oportunidade</p>
                <p className="text-sm text-yellow-600">
                  Futebol com 15% mais oportunidades
                </p>
              </div>
              <PieChart className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Melhores Horários
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 14:00-16:00: Maior volume de oportunidades</li>
              <li>• 20:00-22:00: Melhores odds para futebol</li>
              <li>• Finais de semana: 40% mais arbitragens</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recomendações</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Foque em Bet365 e William Hill</li>
              <li>• Aumente apostas em futebol</li>
              <li>• Evite odds abaixo de 1.5</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
