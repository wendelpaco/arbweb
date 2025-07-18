import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MetricsCard } from "../components/dashboard/MetricsCard";
import { ProfitChart } from "../components/charts/ProfitChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  PieChart,
  Printer,
  Share2,
  Eye,
  Settings,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("monthly");
  const [selectedFormat, setSelectedFormat] = useState("pdf");

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
    console.log("Generating report:", selectedReport, selectedFormat);
  };

  const handleDownloadReport = (reportId: string) => {
    console.log("Downloading report:", reportId);
  };

  const handleViewReport = (reportId: string) => {
    console.log("Viewing report:", reportId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Geração e gerenciamento de relatórios</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
            Configurações
          </Button>
          <Button leftIcon={<FileText className="w-4 h-4" />}>
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Gerador de Relatórios */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Gerar Novo Relatório
          </h3>
          <p className="text-sm text-gray-500">
            Crie relatórios personalizados com filtros avançados
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="input-field"
            >
              {reports.map((report) => (
                <option key={report.value} value={report.value}>
                  {report.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="input-field"
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerateReport}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Gerar Relatório
            </Button>
          </div>
        </div>
      </Card>

      {/* Métricas de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Relatórios Gerados"
          value="24"
          change={8.2}
          changeType="positive"
          icon={<FileText className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Total de Downloads"
          value="156"
          change={12.5}
          changeType="positive"
          icon={<Download className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Tamanho Médio"
          value="2.1 MB"
          change={-3.1}
          changeType="negative"
          icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
        />
        <MetricsCard
          title="Taxa de Sucesso"
          value={formatPercentage(98.5)}
          change={2.3}
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
          variant="success"
        />
      </div>

      {/* Gráficos de Relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitChart data={reportData} />
        <DistributionChart
          data={bookmakerReport}
          title="Relatório por Casas"
          subtitle="Dados de performance por casa de apostas"
        />
      </div>

      {/* Relatórios Recentes */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
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
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-500">
                    {report.date} • {report.size} • {report.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewReport(report.id)}
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  Visualizar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadReport(report.id)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  Compartilhar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Relatórios por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart
          data={sportReport}
          title="Relatório por Esportes"
          subtitle="Performance por categoria esportiva"
        />
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Relatórios Automáticos
            </h3>
            <p className="text-sm text-gray-500">
              Configurações de relatórios programados
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Relatório Diário</p>
                <p className="text-sm text-green-600">
                  Gerado automaticamente às 23:59
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Relatório Semanal</p>
                <p className="text-sm text-blue-600">
                  Gerado aos domingos às 00:00
                </p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-800">Relatório Mensal</p>
                <p className="text-sm text-purple-600">
                  Gerado no último dia do mês
                </p>
              </div>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Templates de Relatórios */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Templates de Relatórios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="w-6 h-6 text-primary-600" />
              <h4 className="font-medium text-gray-900">Relatório Executivo</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Resumo executivo com métricas principais e gráficos
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Usar Template
            </Button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h4 className="font-medium text-gray-900">Relatório Detalhado</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Análise completa com todos os dados e insights
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Usar Template
            </Button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <PieChart className="w-6 h-6 text-primary-600" />
              <h4 className="font-medium text-gray-900">
                Relatório Comparativo
              </h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Comparação entre períodos e benchmarks
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Usar Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Configurações de Exportação */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configurações de Exportação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Formato Padrão</h4>
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
            <h4 className="font-medium text-gray-900 mb-3">
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
                <span className="text-sm">Dados brutos (apenas Excel/CSV)</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
