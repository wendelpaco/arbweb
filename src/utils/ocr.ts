import { ArbitrageData, Bookmaker, Match, Metrics } from "../types";
import Tesseract from "tesseract.js";

// Simulação de processamento OCR
export const processImageOCR = async (
  file: File
): Promise<Partial<ArbitrageData>> => {
  // Simular delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Dados simulados baseados no tipo de arquivo
  const fileName = file.name.toLowerCase();

  // Detectar esporte baseado no nome do arquivo
  let sport = "Futebol";
  if (fileName.includes("basquete") || fileName.includes("basketball"))
    sport = "Basquete";
  if (fileName.includes("tenis") || fileName.includes("tennis"))
    sport = "Tênis";
  if (fileName.includes("vôlei") || fileName.includes("volleyball"))
    sport = "Vôlei";

  // Gerar dados simulados
  const match: Match = {
    team1: "Time A",
    team2: "Time B",
    sport,
    competition: "Liga Nacional",
  };

  // Gerar casas de apostas simuladas
  const bookmakers: Bookmaker[] = [
    {
      name: "Bet365",
      odds: 1.85,
      betType: "Casa",
      stake: 100,
      profit: 85,
    },
    {
      name: "William Hill",
      odds: 2.1,
      betType: "Fora",
      stake: 88.1,
      profit: 96.9,
    },
    {
      name: "Unibet",
      odds: 1.95,
      betType: "Empate",
      stake: 92.3,
      profit: 87.7,
    },
  ];

  // Calcular métricas
  const totalStake = bookmakers.reduce((sum, bm) => sum + bm.stake, 0);
  const totalProfit =
    bookmakers.reduce((sum, bm) => sum + bm.profit, 0) - totalStake;
  const profitPercentage = (totalProfit / totalStake) * 100;
  const roi = (totalProfit / totalStake) * 100;
  const arbitragePercentage =
    (1 / bookmakers.reduce((sum, bm) => sum + 1 / bm.odds, 0)) * 100;

  const metrics: Metrics = {
    totalProfit,
    profitPercentage,
    roi,
    totalStake,
    arbitragePercentage,
  };

  return {
    match,
    bookmakers,
    metrics,
  };
};

export async function extractTextFromImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const { data } = await Tesseract.recognize(
          e.target?.result as string,
          "por"
        );
        resolve(data.text);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Validação de arquivo
export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return "Tipo de arquivo não suportado. Use apenas JPG, JPEG ou PNG.";
  }

  if (file.size > maxSize) {
    return "Arquivo muito grande. Tamanho máximo: 10MB.";
  }

  return null;
};

// Compressão de imagem
export const compressImage = async (
  file: File,
  maxWidth = 1920
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Função auxiliar para gerar possíveis stakes a partir de número colado
function getPossibleStakes(stakeRaw: string): number[] {
  const results: number[] = [];
  for (let i = 2; i <= Math.min(4, stakeRaw.length - 1); i++) {
    const stake = parseFloat(stakeRaw.slice(0, -i) + "." + stakeRaw.slice(-i));
    if (!isNaN(stake)) results.push(stake);
  }
  return results;
}

// Parser robusto para texto OCR ruidoso (ex: SureBet)
export function parseArbitrageFromText(text: string) {
  const lines = text
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);
  let match = { team1: "", team2: "", sport: "", competition: "" };
  let bookmakers = [];
  let totalStakeExtracted = 0;

  // Detectar times e competição
  for (let line of lines) {
    if (!match.team1 && line.match(/—|-/)) {
      const [team1, team2] = line.split(/—|-/).map((s) => s.trim());
      if (team1 && team2) {
        match.team1 = team1;
        match.team2 = team2.replace(/\d+\.?\d*%?$/, "").trim(); // Remove % do final
      }
    }
    if (
      !match.sport &&
      /league of legends|futebol|basquete|tenis|vôlei/i.test(line)
    ) {
      match.sport = line
        .split("/")[0]
        .replace(/\d+\.?\d*%?$/, "")
        .trim();
    }
    if (!match.competition && line.includes("/")) {
      match.competition =
        line
          .split("/")[1]
          ?.replace(/\d+\.?\d*%?$/, "")
          .trim() || "";
    }
    // Detectar aposta total
    if (line.toLowerCase().includes("aposta total")) {
      const totalMatch = line.match(/([0-9]{2,6}(?:[.,][0-9]{1,2})?)/);
      if (totalMatch) {
        let totalStr = totalMatch[1].replace(/,/g, ".");
        if (/^\d{5,}$/.test(totalStr) && !totalStr.includes(".")) {
          totalStr = totalStr.slice(0, -2) + "." + totalStr.slice(-2);
        }
        totalStakeExtracted = parseFloat(totalStr);
      }
    }
  }

  // Regex aprimorada para odds, stake e lucro mesmo com ruído
  const regex =
    /([A-Za-z0-9 ()\-+\.]+)\s+([0-9]{1,3}[.,][0-9]{2,3})[^0-9]*([0-9]{1,4}[.,][0-9]{2}|[0-9]{5,})[^0-9]*([0-9]{1,3}[.,][0-9]{2})/;
  let tempBookmakers = [];
  for (let line of lines) {
    const m = line.match(regex);
    if (m) {
      let name = m[1].replace(/[^\w\s\-()]/g, "").trim();
      let odds = parseFloat(m[2].replace(",", "."));
      let stakeRaw = m[3];
      let profit = parseFloat(m[4].replace(",", "."));
      // LOG para debug de extração
      console.log("Linha OCR:", line);
      console.log("Extraído:", { name, odds, stakeRaw, profit });
      tempBookmakers.push({ name, odds, stakeRaw, profit, betType: "" });
    }
  }

  // Gerar todas as combinações possíveis de stakes
  function getAllStakeCombinations(bookmakers: any[]): number[][] {
    if (bookmakers.length === 0) return [[]];
    const [first, ...rest] = bookmakers;
    let options: number[] = [];
    if (/^\d{5,}$/.test(first.stakeRaw) && !first.stakeRaw.includes(".")) {
      options = getPossibleStakes(first.stakeRaw);
    } else {
      options = [parseFloat(first.stakeRaw.replace(",", "."))];
    }
    const restComb: number[][] = getAllStakeCombinations(rest);
    const result: number[][] = [];
    for (const opt of options) {
      for (const comb of restComb) {
        result.push([opt, ...comb]);
      }
    }
    return result;
  }

  let bestCombo: number[] | null = null;
  let minDiff = Infinity;
  const allComb: number[][] = getAllStakeCombinations(tempBookmakers);
  for (const combo of allComb) {
    const sum = combo.reduce((a: number, b: number) => a + b, 0);
    const diff = Math.abs(sum - totalStakeExtracted);
    if (diff < minDiff) {
      minDiff = diff;
      bestCombo = combo;
    }
  }

  // Montar bookmakers finais
  bookmakers = tempBookmakers.map((bm: any, i: number) => ({
    name: bm.name,
    odds: bm.odds,
    betType: bm.betType,
    stake: bestCombo ? bestCombo[i] : parseFloat(bm.stakeRaw.replace(",", ".")),
    profit: bm.profit,
  }));

  return { match, bookmakers };
}
