import React, { useState } from "react";
import { Bookmaker, Match } from "../../types";
import { Button } from "./Button";
import { Card } from "./Card";

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
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>(initialBookmakers);

  React.useEffect(() => {
    setMatch(initialMatch);
    setBookmakers(initialBookmakers);
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
        <h3 className="font-semibold mb-2">Casas de Apostas</h3>
        <div className="space-y-4 mb-6">
          {bookmakers.map((bm, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
            >
              <input
                className="border rounded px-2 py-1"
                value={bm.name}
                onChange={(e) =>
                  handleBookmakerChange(i, "name", e.target.value)
                }
                placeholder="Casa"
              />
              <input
                className="border rounded px-2 py-1"
                type="number"
                value={bm.odds}
                onChange={(e) =>
                  handleBookmakerChange(i, "odds", e.target.value)
                }
                placeholder="Odds"
                step="0.01"
              />
              <input
                className="border rounded px-2 py-1"
                value={bm.betType}
                onChange={(e) =>
                  handleBookmakerChange(i, "betType", e.target.value)
                }
                placeholder="Tipo"
              />
              <input
                className="border rounded px-2 py-1"
                type="number"
                value={bm.stake}
                onChange={(e) =>
                  handleBookmakerChange(i, "stake", e.target.value)
                }
                placeholder="Stake"
                step="0.01"
              />
              <input
                className="border rounded px-2 py-1"
                type="number"
                value={bm.profit}
                onChange={(e) =>
                  handleBookmakerChange(i, "profit", e.target.value)
                }
                placeholder="Payout"
                step="0.01"
              />
            </div>
          ))}
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
