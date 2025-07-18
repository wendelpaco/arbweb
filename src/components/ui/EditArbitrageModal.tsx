import React, { useState, useMemo } from "react";
import { Bookmaker, Match } from "../../types";
import { Button } from "./Button";
import { Card } from "./Card";
import { validateAndCalculateArbitrage } from "../../utils/calculations";

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

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

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
    // Só considerar linhas com odds e stake > 0
    const validBookmakers = (bookmakers ?? []).filter(
      (bm) => bm.odds > 0 && bm.stake > 0
    );
    return validateAndCalculateArbitrage(validBookmakers);
  }, [bookmakers]);

  const isLucrativa =
    arbitrageInfo.isValid && arbitrageInfo.metrics.totalProfit > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Card className="w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Editar Arbitragem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time 1
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={match.team1}
              onChange={(e) => handleMatchChange("team1", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time 2
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={match.team2}
              onChange={(e) => handleMatchChange("team2", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Esporte
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={match.sport}
              onChange={(e) => handleMatchChange("sport", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Competição
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={match.competition}
              onChange={(e) => handleMatchChange("competition", e.target.value)}
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
          Casas de Apostas
          <Button size="sm" variant="outline" onClick={handleAddBookmaker}>
            + Adicionar Linha
          </Button>
        </h3>
        {/* Aviso de arbitragem em tempo real */}
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
            <span className="text-sm text-gray-700">
              Percentual:{" "}
              <b>{arbitrageInfo.metrics.arbitragePercentage.toFixed(2)}%</b>
            </span>
            <span className="text-sm text-gray-700">
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
              <tr className="text-gray-600">
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
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={bm.name}
                      onChange={(e) =>
                        handleBookmakerChange(i, "name", e.target.value)
                      }
                      placeholder="Casa"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      className="border rounded px-2 py-1 w-20 text-right"
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
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={bm.betType}
                      onChange={(e) =>
                        handleBookmakerChange(i, "betType", e.target.value)
                      }
                      placeholder="Tipo"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      className="border rounded px-2 py-1 w-24 text-right"
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
                    <input
                      className="border rounded px-2 py-1 w-24 text-right"
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
                        className="text-accent-600 hover:text-accent-800 text-lg font-bold px-2"
                        onClick={() => handleRemoveBookmaker(i)}
                        title="Remover linha"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </Card>
    </div>
  );
};
