import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArbitrageData } from "../../types";
import {
  formatPercentage,
  formatRelativeTime,
  formatCurrency,
} from "../../utils/formatters";
import { Search, Filter } from "lucide-react";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useLocalStorageSync } from "../../hooks/use-local-storage-sync";

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

  // Sincronizar com localStorage para garantir dados atualizados
  const [localStorageData] = useLocalStorageSync("arbitrage-storage", {
    state: { arbitrages: [] },
  });

  // Usar dados do localStorage se disponíveis, senão usar props
  const displayArbitrages =
    localStorageData?.state?.arbitrages?.length > 0
      ? localStorageData.state.arbitrages
      : arbitrages;

  const filteredArbitrages = displayArbitrages.filter(
    (arbitrage) =>
      arbitrage.match &&
      ((arbitrage.match.team1 &&
        arbitrage.match.team1
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
        (arbitrage.match.team2 &&
          arbitrage.match.team2
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (arbitrage.match.sport &&
          arbitrage.match.sport
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (arbitrage.match.competition &&
          arbitrage.match.competition
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        arbitrage.bookmakers.some((bm) =>
          bm.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  return (
    <Card className="p-0 overflow-hidden mt-4 rounded-2xl shadow-md bg-white dark:bg-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Oportunidades de Arbitragem
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Label htmlFor="search-arbs" className="sr-only">
            Buscar arbitragens
          </Label>
          <Input
            id="search-arbs"
            type="text"
            placeholder="Buscar arbitragens..."
            className="h-10 w-full sm:w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 z-10">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                Data
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                Partida
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                Esporte
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                Lucro
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                ROI
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                Stake
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left font-semibold text-zinc-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredArbitrages.map((arb) => (
              <tr
                key={arb.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-zinc-700 dark:text-zinc-200">
                  {arb.timestamp
                    ? formatRelativeTime(new Date(arb.timestamp))
                    : "-"}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-zinc-900 dark:text-zinc-100">
                  <div className="max-w-[120px] sm:max-w-none">
                    <div className="truncate">
                      {arb.match?.team1} vs {arb.match?.team2}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {arb.match?.competition}
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs">
                    {arb.match?.sport}
                  </span>
                </td>
                <td
                  className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold ${
                    arb.metrics?.totalProfit < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {formatCurrency(arb.metrics?.totalProfit)}
                </td>
                <td
                  className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-semibold ${
                    arb.metrics?.roi < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {formatPercentage(arb.metrics?.roi)}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  {formatCurrency(arb.metrics?.totalStake)}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Ver"
                          title="Ver"
                          onClick={() => onView(arb)}
                          className="focus-visible:ring-2 focus-visible:ring-primary-500 p-1 sm:p-2"
                        >
                          <svg
                            width="14"
                            height="14"
                            className="sm:w-4 sm:h-4"
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
                      <TooltipContent side="top">Ver detalhes</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Editar"
                          title="Editar"
                          onClick={() => onEdit(arb)}
                          className="focus-visible:ring-2 focus-visible:ring-primary-500 p-1 sm:p-2"
                        >
                          <svg
                            width="14"
                            height="14"
                            className="sm:w-4 sm:h-4"
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
                          onClick={() => onDelete(arb.id)}
                          className="focus-visible:ring-2 focus-visible:ring-primary-500 p-1 sm:p-2"
                        >
                          <svg
                            width="14"
                            height="14"
                            className="sm:w-4 sm:h-4"
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

      {filteredArbitrages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-zinc-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-zinc-500">Nenhuma arbitragem encontrada</p>
        </div>
      )}
    </Card>
  );
};
