import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ArbitrageData } from "../../types";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  formatProfit,
  formatROI,
} from "../../utils/formatters";
import { Search, Filter, MoreVertical, Eye, Trash2, Edit } from "lucide-react";

interface ArbitrageTableProps {
  arbitrages: ArbitrageData[];
  onView: (arbitrage: ArbitrageData) => void;
  onEdit: (arbitrage: ArbitrageData) => void;
  onDelete: (id: string) => void;
}

export const ArbitrageTable: React.FC<ArbitrageTableProps> = ({
  arbitrages,
  onView,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof ArbitrageData>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredArbitrages = arbitrages.filter(
    (arbitrage) =>
      arbitrage.match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arbitrage.match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arbitrage.match.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arbitrage.bookmakers.some((bm) =>
        bm.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const sortedArbitrages = [...filteredArbitrages].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof ArbitrageData) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ column }: { column: keyof ArbitrageData }) => {
    if (sortBy !== column) return null;
    return <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Oportunidades de Arbitragem
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar arbitragens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filtros
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("timestamp")}
              >
                Data <SortIcon column="timestamp" />
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Partida
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Esporte
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("metrics")}
              >
                Lucro <SortIcon column="metrics" />
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                ROI
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Casas
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedArbitrages.map((arbitrage) => (
              <tr
                key={arbitrage.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateShort(arbitrage.timestamp)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeTime(arbitrage.timestamp)}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {arbitrage.match.team1} vs {arbitrage.match.team2}
                    </div>
                    <div className="text-sm text-gray-500">
                      {arbitrage.match.competition}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {arbitrage.match.sport}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div
                    className={`font-medium ${
                      arbitrage.metrics.totalProfit >= 0
                        ? "text-secondary-600"
                        : "text-accent-600"
                    }`}
                  >
                    {formatProfit(arbitrage.metrics.totalProfit)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPercentage(arbitrage.metrics.profitPercentage)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div
                    className={`font-medium ${
                      arbitrage.metrics.roi >= 0
                        ? "text-secondary-600"
                        : "text-accent-600"
                    }`}
                  >
                    {formatROI(arbitrage.metrics.roi)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">
                    {arbitrage.bookmakers.length} casas
                  </div>
                  <div className="text-xs text-gray-500">
                    {arbitrage.bookmakers.map((bm) => bm.name).join(", ")}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(arbitrage)}
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(arbitrage)}
                      leftIcon={<Edit className="w-4 h-4" />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(arbitrage.id)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedArbitrages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">Nenhuma arbitragem encontrada</p>
        </div>
      )}
    </Card>
  );
};
