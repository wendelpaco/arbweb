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
import { Label } from "./Label";
import { Input } from "./Input";

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
      prev.map((bm, i) =>
        i === index
          ? {
              ...bm,
              [field]:
                field === "odds" || field === "stake" || field === "profit"
                  ? Number(value)
                  : value,
            }
          : bm
      )
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
    return validateAndCalculateArbitrage(validBookmakers);
  }, [bookmakers]);

  const isLucrativa =
    arbitrageInfo.isValid && arbitrageInfo.metrics.totalProfit > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-8 rounded-2xl shadow-2xl bg-white dark:bg-zinc-950 animate-in fade-in-0 scale-in-95">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Editar Arbitragem
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Edite os dados da arbitragem e salve as alterações.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="team1">Time 1</Label>
            <Input
              id="team1"
              value={match.team1}
              onChange={(e) => handleMatchChange("team1", e.target.value)}
              placeholder="Time 1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="team2">Time 2</Label>
            <Input
              id="team2"
              value={match.team2}
              onChange={(e) => handleMatchChange("team2", e.target.value)}
              placeholder="Time 2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sport">Esporte</Label>
            <Input
              id="sport"
              value={match.sport}
              onChange={(e) => handleMatchChange("sport", e.target.value)}
              placeholder="Esporte"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="competition">Competição</Label>
            <Input
              id="competition"
              value={match.competition}
              onChange={(e) => handleMatchChange("competition", e.target.value)}
              placeholder="Competição"
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
          Casas de Apostas
          <Button size="sm" variant="outline" onClick={handleAddBookmaker}>
            + Adicionar Linha
          </Button>
        </h3>
        {bookmakers.length > 1 && (
          <div
            className={`mb-4 p-3 rounded flex items-center space-x-3 ${
              isLucrativa
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <span
              className={`font-bold text-lg ${
                isLucrativa ? "text-green-700" : "text-red-700"
              }`}
            >
              {isLucrativa
                ? "Arbitragem Lucrativa"
                : "Arbitragem Não Lucrativa"}
            </span>
            <span className="text-sm text-zinc-700 dark:text-zinc-200">
              Percentual:{" "}
              <b>{arbitrageInfo.metrics.arbitragePercentage.toFixed(2)}%</b>
            </span>
            <span className="text-sm text-zinc-700 dark:text-zinc-200">
              Lucro Garantido:{" "}
              <b>
                {arbitrageInfo.metrics.totalProfit.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </b>
            </span>
          </div>
        )}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-600">
                <th className="px-2 py-1 text-left">Casa</th>
                <th className="px-2 py-1 text-left">Odds</th>
                <th className="px-2 py-1 text-left">Tipo</th>
                <th className="px-2 py-1 text-left">Stake</th>
                <th className="px-2 py-1 text-left">Payout</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookmakers.map((bm, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="px-2 py-1">
                    <Input
                      value={bm.name}
                      onChange={(e) =>
                        handleBookmakerChange(i, "name", e.target.value)
                      }
                      placeholder="Casa"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="text"
                      value={bm.odds}
                      onChange={(e) =>
                        handleBookmakerChange(
                          i,
                          "odds",
                          formatNumberInput(e.target.value)
                        )
                      }
                      placeholder="Odds"
                      inputMode="decimal"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      value={bm.betType}
                      onChange={(e) =>
                        handleBookmakerChange(i, "betType", e.target.value)
                      }
                      placeholder="Tipo"
                    />
                  </td>
                  <td className="px-2 py-1">
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
                    />
                  </td>
                  <td className="px-2 py-1">
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
                    />
                  </td>
                  <td className="px-2 py-1 text-center align-middle">
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
        <DialogFooter className="mt-8 flex gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave}>
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
