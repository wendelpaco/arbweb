import React, { useState, useMemo } from "react";
import { Bookmaker, Match } from "../../types";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { validateAndCalculateArbitrage } from "../../utils/calculations";
import { X } from "lucide-react";
import { Input } from "./Input";
import { formatOdds } from "../../utils/formatters";
import { Label } from "@radix-ui/react-label";

function formatNumberInput(value: string | number) {
  if (typeof value === "number") return value;
  return value.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
}

interface EditArbitrageModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  bookmakers: Bookmaker[];
  onSave: (match: Match, bookmakers: Bookmaker[]) => void;
}

export const EditArbitrageModal: React.FC<EditArbitrageModalProps> = ({
  isOpen,
  onClose,
  match: initialMatch,
  bookmakers: initialBookmakers,
  onSave,
}) => {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>(
    initialBookmakers ?? []
  );

  React.useEffect(() => {
    setMatch(initialMatch);
    setBookmakers(initialBookmakers ?? []);
  }, [initialMatch, initialBookmakers, isOpen]);

  const handleBookmakerChange = (
    index: number,
    field: keyof Bookmaker,
    value: string | number
  ) => {
    setBookmakers((prev) =>
      prev.map((bm, i) => {
        if (i === index) {
          const updatedBm = {
            ...bm,
            [field]:
              field === "odds" || field === "stake" || field === "profit"
                ? Number(value)
                : value,
          };

          // Recalcular payout automaticamente quando stake ou odds mudam
          if (field === "stake" || field === "odds") {
            updatedBm.profit = updatedBm.stake * updatedBm.odds;
          }

          return updatedBm;
        }
        return bm;
      })
    );
  };

  const handleMatchChange = (field: keyof Match, value: string) => {
    setMatch((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(match, bookmakers);
    onClose();
  };

  const handleAddBookmaker = () => {
    setBookmakers((prev) => [
      ...prev,
      { name: "", odds: 0, betType: "", stake: 0, profit: 0 },
    ]);
  };

  const handleRemoveBookmaker = (index: number) => {
    setBookmakers((prev) => prev.filter((_, i) => i !== index));
  };

  // Cálculo em tempo real
  const arbitrageInfo = useMemo(() => {
    const validBookmakers = (bookmakers ?? []).filter(
      (bm) => bm.odds > 0 && bm.stake > 0
    );

    // Recalcular profit para cada bookmaker baseado em stake e odds
    const updatedBookmakers = validBookmakers.map((bm) => ({
      ...bm,
      profit: bm.stake * bm.odds,
    }));

    return validateAndCalculateArbitrage(updatedBookmakers);
  }, [bookmakers]);

  const isLucrativa =
    arbitrageInfo.isValid && arbitrageInfo.metrics.totalProfit > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 animate-in fade-in-0 scale-in-95">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Editar Arbitragem
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Edite os dados da arbitragem e salve as alterações.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="team1" className="text-sm font-medium">
              Time 1
            </Label>
            <Input
              id="team1"
              value={match.team1}
              onChange={(e) => handleMatchChange("team1", e.target.value)}
              placeholder="Time 1"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="team2" className="text-sm font-medium">
              Time 2
            </Label>
            <Input
              id="team2"
              value={match.team2}
              onChange={(e) => handleMatchChange("team2", e.target.value)}
              placeholder="Time 2"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sport" className="text-sm font-medium">
              Esporte
            </Label>
            <Input
              id="sport"
              value={match.sport}
              onChange={(e) => handleMatchChange("sport", e.target.value)}
              placeholder="Esporte"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="competition" className="text-sm font-medium">
              Competição
            </Label>
            <Input
              id="competition"
              value={match.competition}
              onChange={(e) => handleMatchChange("competition", e.target.value)}
              placeholder="Competição"
              className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Casas de Apostas
          </h3>
          <Button
            size="sm"
            variant="default"
            className="rounded-xl shadow-premium px-3 py-2 text-sm"
            onClick={handleAddBookmaker}
          >
            + Adicionar Linha
          </Button>
        </div>

        {bookmakers.length > 1 && (
          <div
            className={`mb-4 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 ${
              arbitrageInfo.isValid && isLucrativa
                ? "bg-green-50 border border-green-200"
                : arbitrageInfo.isValid
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <span
              className={`font-bold text-base sm:text-lg ${
                arbitrageInfo.isValid && isLucrativa
                  ? "text-green-700"
                  : arbitrageInfo.isValid
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              {arbitrageInfo.isValid && isLucrativa
                ? "Arbitragem Lucrativa"
                : arbitrageInfo.isValid
                ? "Arbitragem Válida (Sem Lucro)"
                : "Arbitragem Inválida"}
            </span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
              <span className="text-zinc-700 dark:text-zinc-200">
                Percentual:{" "}
                <b>
                  {(arbitrageInfo.metrics.arbitragePercentage - 100).toFixed(2)}
                  %
                </b>
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">
                Lucro Garantido:{" "}
                <b
                  className={
                    arbitrageInfo.metrics.totalProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {arbitrageInfo.metrics.totalProfit.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </b>
              </span>
              {!arbitrageInfo.isValid && (
                <span className="text-red-600 text-xs">
                  {arbitrageInfo.message}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs sm:text-sm rounded-xl overflow-hidden min-w-[600px]">
            <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 z-10">
              <tr className="text-zinc-600 dark:text-zinc-300">
                <th className="px-2 py-2 text-left">Casa</th>
                <th className="px-2 py-2 text-left">Odds</th>
                <th className="px-2 py-2 text-left">Tipo</th>
                <th className="px-2 py-2 text-left">Stake</th>
                <th className="px-2 py-2 text-left">Payout</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookmakers.map((bm, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0 border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-2 py-2">
                    <Input
                      value={bm.name}
                      onChange={(e) =>
                        handleBookmakerChange(i, "name", e.target.value)
                      }
                      placeholder="Casa"
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="text"
                      value={formatOdds(bm.odds)}
                      onChange={(e) =>
                        handleBookmakerChange(
                          i,
                          "odds",
                          formatNumberInput(e.target.value)
                        )
                      }
                      placeholder="Odds"
                      inputMode="decimal"
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      value={bm.betType}
                      onChange={(e) =>
                        handleBookmakerChange(i, "betType", e.target.value)
                      }
                      placeholder="Tipo"
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="text"
                      value={bm.stake}
                      onChange={(e) =>
                        handleBookmakerChange(
                          i,
                          "stake",
                          formatNumberInput(e.target.value)
                        )
                      }
                      placeholder="Stake"
                      inputMode="decimal"
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all text-xs"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      type="text"
                      value={bm.profit}
                      onChange={(e) =>
                        handleBookmakerChange(
                          i,
                          "profit",
                          formatNumberInput(e.target.value)
                        )
                      }
                      placeholder="Payout"
                      inputMode="decimal"
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-all text-xs"
                    />
                  </td>
                  <td className="px-2 py-2 text-center align-middle">
                    {bookmakers.length > 2 && (
                      <button
                        type="button"
                        className="text-accent-600 hover:text-accent-800 text-lg font-bold px-2 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-full"
                        onClick={() => handleRemoveBookmaker(i)}
                        title="Remover linha"
                        aria-label="Remover linha"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            variant="outline"
            className="rounded-xl px-6 py-2 text-sm font-medium w-full sm:w-auto"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            className="rounded-xl px-6 py-2 text-sm font-medium w-full sm:w-auto"
            onClick={handleSave}
          >
            Salvar
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
  );
};
