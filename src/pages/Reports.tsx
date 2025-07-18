import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  PieChart,
  Share2,
  Eye,
  X,
  CheckCircle,
} from "lucide-react";
import { formatPercentage } from "../utils/formatters";
import { MetricCard } from "../components/dashboard/MetricsCard";
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

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("monthly");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const reports = [
    { value: "daily", label: "Relatório Diário" },
    { value: "weekly", label: "Relatório Semanal" },
    { value: "monthly", label: "Relatório Mensal" },
    { value: "quarterly", label: "Relatório Trimestral" },
    { value: "annual", label: "Relatório Anual" },
  ];

  const formats = [
    { value: "pdf", label: "PDF" },
    { value: "csv", label: "CSV" },
    { value: "excel", label: "Excel" },
    { value: "json", label: "JSON" },
  ];

  // Dados simulados para relatórios
  const reportData = [
    { date: "2024-01-01", profit: 150, volume: 1200, arbitrages: 8 },
    { date: "2024-01-02", profit: 230, volume: 1800, arbitrages: 12 },
    { date: "2024-01-03", profit: 180, volume: 1500, arbitrages: 10 },
    { date: "2024-01-04", profit: 320, volume: 2200, arbitrages: 15 },
    { date: "2024-01-05", profit: 280, volume: 2000, arbitrages: 13 },
    { date: "2024-01-06", profit: 450, volume: 2800, arbitrages: 18 },
    { date: "2024-01-07", profit: 380, volume: 2400, arbitrages: 16 },
  ];

  const bookmakerReport = [
    { name: "Bet365", count: 45, totalProfit: 1250, avgRoi: 5.2 },
    { name: "William Hill", count: 32, totalProfit: 890, avgRoi: 4.8 },
    { name: "Unibet", count: 28, totalProfit: 720, avgRoi: 4.1 },
    { name: "Betfair", count: 22, totalProfit: 580, avgRoi: 3.9 },
    { name: "Pinnacle", count: 18, totalProfit: 420, avgRoi: 3.5 },
  ];

  const sportReport = [
    { name: "Futebol", count: 65, totalProfit: 1850, avgRoi: 5.8 },
    { name: "Basquete", count: 28, totalProfit: 720, avgRoi: 4.2 },
    { name: "Tênis", count: 22, totalProfit: 580, avgRoi: 3.8 },
    { name: "Vôlei", count: 15, totalProfit: 320, avgRoi: 3.2 },
  ];

  const recentReports = [
    {
      id: "1",
      name: "Relatório Mensal - Janeiro 2024",
      type: "monthly",
      date: "2024-01-31",
      size: "2.3 MB",
      status: "completed",
    },
    {
      id: "2",
      name: "Relatório Semanal - Semana 4",
      type: "weekly",
      date: "2024-01-28",
      size: "1.1 MB",
      status: "completed",
    },
    {
      id: "3",
      name: "Relatório Diário - 27/01/2024",
      type: "daily",
      date: "2024-01-27",
      size: "0.8 MB",
      status: "completed",
    },
    {
      id: "4",
      name: "Relatório Trimestral - Q4 2023",
      type: "quarterly",
      date: "2023-12-31",
      size: "5.2 MB",
      status: "completed",
    },
  ];

  const handleGenerateReport = () => {
    setToastMsg("Relatório gerado com sucesso!");
    setShowToast(true);
  };

  const handleDownloadReport = (reportId: string) => {
    setToastMsg("Download iniciado para o relatório " + reportId);
    setShowToast(true);
  };

  const handleViewReport = (reportId: string) => {
    setToastMsg("Visualizando relatório " + reportId);
    setShowToast(true);
  };

  return (
    <TooltipProvider>
      <ToastProvider>
        <section className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 py-2">
          <div className="max-w-screen-xl mx-auto px-4 space-y-10">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Relatórios
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
            {/* Gerador de Relatórios */}
            <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Gerar Novo Relatório
                </h3>
                <p className="text-sm text-zinc-500">
                  Crie relatórios personalizados com filtros avançados
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">
                    Tipo de Relatório
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full"
                  >
                    {reports.map((report) => (
                      <option key={report.value} value={report.value}>
                        {report.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">
                    Formato
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 w-full"
                  >
                    {formats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleGenerateReport} className="w-full">
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </Card>
            {/* Métricas de Relatórios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <MetricCard
                title="Relatórios Gerados"
                value="24"
                change={8.2}
                changeType="positive"
                icon={<FileText className="w-6 h-6 text-primary-600" />}
              />
              <MetricCard
                title="Total de Downloads"
                value="156"
                change={12.5}
                changeType="positive"
                icon={<Download className="w-6 h-6 text-primary-600" />}
              />
              <MetricCard
                title="Tamanho Médio"
                value="2.1 MB"
                change={-3.1}
                changeType="negative"
                icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
              />
              <MetricCard
                title="Taxa de Sucesso"
                value={formatPercentage(98.5)}
                change={2.3}
                changeType="positive"
                icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
                variant="success"
              />
            </div>
            {/* Gráficos de Relatórios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Lucro ao longo do tempo
                </h3>
                <ProfitChart data={reportData} />
              </Card>
              <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Relatório por Casas
                </h3>
                <DistributionChart
                  data={bookmakerReport}
                  title="Relatório por Casas"
                  subtitle="Dados de performance por casa de apostas"
                />
              </Card>
            </div>
            {/* Relatórios Recentes */}
            <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Relatórios Recentes
                </h3>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {report.name}
                        </h4>
                        <p className="text-sm text-zinc-500">
                          {report.date} • {report.size} • {report.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report.id)}
                            className="focus-visible:ring-2 focus-visible:ring-primary-500"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Visualizar</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                            className="focus-visible:ring-2 focus-visible:ring-primary-500"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Download</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="focus-visible:ring-2 focus-visible:ring-primary-500"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Compartilhar</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            {/* Relatórios por Categoria */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Relatório por Esportes
                </h3>
                <DistributionChart
                  data={sportReport}
                  title="Relatório por Esportes"
                  subtitle="Performance por categoria esportiva"
                />
              </Card>
              <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Relatórios Automáticos
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        Relatório Diário
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-200">
                        Gerado automaticamente às 23:59
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">
                        Relatório Semanal
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-200">
                        Gerado aos domingos às 00:00
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-800 dark:text-purple-300">
                        Relatório Mensal
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-200">
                        Gerado no último dia do mês
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </Card>
            </div>
            {/* Templates de Relatórios */}
            <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Templates de Relatórios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-400 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                      Relatório Executivo
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Resumo executivo com métricas principais e gráficos
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Template
                  </Button>
                </div>
                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-400 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                      Relatório Detalhado
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Análise completa com todos os dados e insights
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Template
                  </Button>
                </div>
                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-400 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <PieChart className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                      Relatório Comparativo
                    </h4>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    Comparação entre períodos e benchmarks
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Template
                  </Button>
                </div>
              </div>
            </Card>
            {/* Configurações de Exportação */}
            <Card className="p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Configurações de Exportação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                    Formato Padrão
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        defaultChecked
                        className="mr-2"
                      />
                      <span className="text-sm">PDF (Recomendado)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="excel"
                        className="mr-2"
                      />
                      <span className="text-sm">Excel (Dados brutos)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        className="mr-2"
                      />
                      <span className="text-sm">CSV (Compatibilidade)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                    Incluir no Relatório
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Gráficos e visualizações</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Métricas detalhadas</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Insights e recomendações</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">
                        Dados brutos (apenas Excel/CSV)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </ToastProvider>
    </TooltipProvider>
  );
};
