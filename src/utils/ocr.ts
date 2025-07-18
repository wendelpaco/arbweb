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
