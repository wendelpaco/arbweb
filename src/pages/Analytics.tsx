import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { MetricCard } from "../components/dashboard/MetricsCard";
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
import { useToast } from "../hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export const Analytics: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedSport, setSelectedSport] = useState("all");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [selectedPeriod, selectedSport]);

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
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Analytics
            </h1>
            <p className="text-zinc-500">
              Análise detalhada de performance e métricas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="lg"
              className="transition-all shadow-premium rounded-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Atualizar
            </Button>
            <Button
              variant="default"
              size="lg"
              className="transition-all shadow-premium rounded-xl"
              onClick={() => {
                toast({
                  title: "Exportação concluída",
                  description: (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                      Os dados foram exportados com sucesso.
                    </span>
                  ),
                  variant: "default",
                });
              }}
            >
              <Download className="w-5 h-5 mr-2" /> Exportar
            </Button>
          </div>
        </div>
        {/* Filtros */}
        <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Filtros
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-zinc-200 dark:border-zinc-700"
            >
              <Filter className="w-5 h-5 text-zinc-400" />
            </Button>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="period">Período</Label>
              <div className="relative">
                <select
                  id="period"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
                >
                  {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sport">Esporte</Label>
              <div className="relative">
                <select
                  id="sport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
                >
                  {sports.map((sport) => (
                    <option key={sport.value} value={sport.value}>
                      {sport.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="roi-min">ROI Mínimo</Label>
              <Input
                id="roi-min"
                type="number"
                placeholder="0.5"
                className="h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
              />
            </div>
          </form>
        </Card>
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <MetricCard
            title="Lucro Total"
            value={formatCurrency(2850)}
            change={12.5}
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
            variant="success"
            tooltip="Lucro total acumulado no período selecionado. Inclui todas as arbitragens realizadas."
            loading={loading}
          />
          <MetricCard
            title="Arbitragens"
            value={125}
            change={8.2}
            changeType="positive"
            icon={<BarChart3 className="w-6 h-6 text-blue-500" />}
            tooltip="Quantidade total de arbitragens executadas no período."
            loading={loading}
          />
          <MetricCard
            title="ROI Médio"
            value={formatPercentage(4.8)}
            change={-2.1}
            changeType="negative"
            icon={<TrendingDown className="w-6 h-6 text-rose-500" />}
            variant="danger"
            tooltip="Retorno sobre investimento médio das arbitragens. Calculado como média ponderada."
            loading={loading}
          />
          <MetricCard
            title="Taxa de Sucesso"
            value={formatPercentage(87.5)}
            change={5.3}
            changeType="positive"
            icon={<PieChart className="w-6 h-6 text-indigo-500" />}
            variant="success"
            tooltip="Percentual de arbitragens bem-sucedidas no período."
            loading={loading}
          />
        </div>
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Lucro ao longo do tempo
            </h3>
            <ProfitChart data={profitData} />
          </Card>
          <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Distribuição por Casas
            </h3>
            <DistributionChart
              data={bookmakerData}
              title="Distribuição por Casas"
              subtitle="Lucro total por casa de apostas"
            />
          </Card>
        </div>
        {/* Gráficos Adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Distribuição por Esportes
            </h3>
            <DistributionChart
              data={sportData}
              title="Distribuição por Esportes"
              subtitle="Lucro total por esporte"
            />
          </Card>
          <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Tendências
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Tendência Positiva
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    ROI aumentando 2.3% por semana
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Volume Estável
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Média de 4.2 arbitragens por dia
                  </p>
                </div>
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Oportunidade
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Futebol com 15% mais oportunidades
                  </p>
                </div>
                <PieChart className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </Card>
        </div>
        {/* Insights */}
        <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900 mb-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Melhores Horários
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>• 14:00-16:00: Maior volume de oportunidades</li>
                <li>• 20:00-22:00: Melhores odds para futebol</li>
                <li>• Finais de semana: 40% mais arbitragens</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Recomendações
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>• Foque em Bet365 e William Hill</li>
                <li>• Aumente apostas em futebol</li>
                <li>• Evite odds abaixo de 1.5</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
