import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { MetricsCard } from "../components/dashboard/MetricsCard";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Star,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";

export const Performance: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("profit");

  const periods = [
    { value: "7d", label: "7 dias" },
    { value: "30d", label: "30 dias" },
    { value: "90d", label: "90 dias" },
    { value: "1y", label: "1 ano" },
  ];

  const metrics = [
    { value: "profit", label: "Lucro" },
    { value: "roi", label: "ROI" },
    { value: "volume", label: "Volume" },
    { value: "success", label: "Taxa de Sucesso" },
  ];

  // Dados simulados para performance
  const performanceData = [
    { date: "2024-01-01", profit: 150, roi: 4.2, volume: 1200, success: 85 },
    { date: "2024-01-02", profit: 230, roi: 5.1, volume: 1800, success: 88 },
    { date: "2024-01-03", profit: 180, roi: 3.8, volume: 1500, success: 82 },
    { date: "2024-01-04", profit: 320, roi: 6.2, volume: 2200, success: 92 },
    { date: "2024-01-05", profit: 280, roi: 5.5, volume: 2000, success: 89 },
    { date: "2024-01-06", profit: 450, roi: 7.8, volume: 2800, success: 95 },
    { date: "2024-01-07", profit: 380, roi: 6.5, volume: 2400, success: 91 },
  ];

  const bookmakerPerformance = [
    {
      name: "Bet365",
      count: 45,
      totalProfit: 1250,
      avgRoi: 5.2,
      successRate: 92,
    },
    {
      name: "William Hill",
      count: 32,
      totalProfit: 890,
      avgRoi: 4.8,
      successRate: 88,
    },
    {
      name: "Unibet",
      count: 28,
      totalProfit: 720,
      avgRoi: 4.1,
      successRate: 85,
    },
    {
      name: "Betfair",
      count: 22,
      totalProfit: 580,
      avgRoi: 3.9,
      successRate: 82,
    },
    {
      name: "Pinnacle",
      count: 18,
      totalProfit: 420,
      avgRoi: 3.5,
      successRate: 78,
    },
  ];

  const sportPerformance = [
    {
      name: "Futebol",
      count: 65,
      totalProfit: 1850,
      avgRoi: 5.8,
      successRate: 90,
    },
    {
      name: "Basquete",
      count: 28,
      totalProfit: 720,
      avgRoi: 4.2,
      successRate: 85,
    },
    {
      name: "Tênis",
      count: 22,
      totalProfit: 580,
      avgRoi: 3.8,
      successRate: 82,
    },
    {
      name: "Vôlei",
      count: 15,
      totalProfit: 320,
      avgRoi: 3.2,
      successRate: 78,
    },
  ];

  const achievements = [
    {
      title: "Maior Lucro Diário",
      value: formatCurrency(450),
      description: "6 de Janeiro de 2024",
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      title: "Melhor ROI",
      value: "7.8%",
      description: "Média de 30 dias",
      icon: <Star className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Mais Arbitragens",
      value: "45",
      description: "Bet365 - Janeiro 2024",
      icon: <Award className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Taxa de Sucesso",
      value: "95%",
      description: "Melhor mês",
      icon: <Target className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-200",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
          <p className="text-gray-600">
            Análise detalhada de performance e conquistas
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Métrica
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="input-field"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={index} className={`${achievement.color} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {achievement.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievement.value}
                </p>
                <p className="text-xs text-gray-500">
                  {achievement.description}
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {achievement.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

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
          title="ROI Médio"
          value={formatPercentage(5.2)}
          change={8.2}
          changeType="positive"
          icon={<Target className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Taxa de Sucesso"
          value={formatPercentage(89.5)}
          change={-2.1}
          changeType="negative"
          icon={<Award className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Volume Total"
          value={formatCurrency(15800)}
          change={15.3}
          changeType="positive"
          icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
          variant="success"
        />
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitChart data={performanceData} />
        <DistributionChart
          data={bookmakerPerformance}
          title="Performance por Casas"
          subtitle="ROI e lucro por casa de apostas"
        />
      </div>

      {/* Performance por Esporte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart
          data={sportPerformance}
          title="Performance por Esportes"
          subtitle="ROI e lucro por esporte"
        />
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tendências de Performance
            </h3>
            <p className="text-sm text-gray-500">
              Análise de tendências ao longo do tempo
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">ROI Crescente</p>
                <p className="text-sm text-green-600">
                  Aumento de 2.3% por semana
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
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-800">Sucesso Alto</p>
                <p className="text-sm text-purple-600">
                  89.5% de taxa de sucesso
                </p>
              </div>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Análise Comparativa */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análise Comparativa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Melhor Casa</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium">Bet365</span>
                <span className="text-sm text-green-600 font-medium">
                  5.2% ROI
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">William Hill</span>
                <span className="text-sm text-blue-600 font-medium">
                  4.8% ROI
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-sm font-medium">Unibet</span>
                <span className="text-sm text-purple-600 font-medium">
                  4.1% ROI
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Melhor Esporte</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium">Futebol</span>
                <span className="text-sm text-green-600 font-medium">
                  5.8% ROI
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">Basquete</span>
                <span className="text-sm text-blue-600 font-medium">
                  4.2% ROI
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-sm font-medium">Tênis</span>
                <span className="text-sm text-purple-600 font-medium">
                  3.8% ROI
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Melhores Horários
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium">14:00-16:00</span>
                <span className="text-sm text-green-600 font-medium">+15%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm font-medium">20:00-22:00</span>
                <span className="text-sm text-blue-600 font-medium">+12%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-sm font-medium">Finais de semana</span>
                <span className="text-sm text-purple-600 font-medium">
                  +25%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recomendações */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recomendações de Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Otimizações Sugeridas
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Foque em Bet365 e William Hill (maior ROI)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Aumente apostas em futebol (5.8% ROI)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Aposte entre 14:00-16:00 (melhor horário)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Evite odds abaixo de 1.5 (baixo ROI)
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Metas de Performance
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Target className="w-4 h-4 text-green-600 mr-2" />
                Aumentar ROI médio para 6.0%
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                Alcançar 95% de taxa de sucesso
              </li>
              <li className="flex items-center">
                <BarChart3 className="w-4 h-4 text-purple-600 mr-2" />
                Processar 5 arbitragens por dia
              </li>
              <li className="flex items-center">
                <Award className="w-4 h-4 text-yellow-600 mr-2" />
                Manter lucro mínimo de R$ 200/dia
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
