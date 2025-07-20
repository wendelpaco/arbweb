import { Bookmaker, Metrics } from "../types";
import { formatCurrency } from "./formatters";

// Validar se é uma arbitragem válida
export const isValidArbitrage = (bookmakers: Bookmaker[]): boolean => {
  const totalArbitrage = bookmakers.reduce((sum, bm) => sum + 1 / bm.odds, 0);
  return totalArbitrage < 1;
};

// Calcular distribuição ótima de apostas
export const calculateOptimalStakes = (
  bookmakers: Bookmaker[],
  totalInvestment: number
): Bookmaker[] => {
  const totalArbitrage = bookmakers.reduce((sum, bm) => sum + 1 / bm.odds, 0);

  if (totalArbitrage >= 1) {
    throw new Error("Não é uma arbitragem válida");
  }

  return bookmakers.map((bm) => ({
    ...bm,
    stake: (totalInvestment * (1 / bm.odds)) / totalArbitrage,
    profit: ((totalInvestment * (1 / bm.odds)) / totalArbitrage) * bm.odds,
  }));
};

// Calcular ROI
export const calculateROI = (profit: number, stake: number): number => {
  return (profit / stake) * 100;
};

// Calcular percentual de lucro
export const calculateProfitPercentage = (
  profit: number,
  stake: number
): number => {
  return (profit / stake) * 100;
};

// Calcular percentual de arbitragem
export const calculateArbitragePercentage = (
  bookmakers: Bookmaker[]
): number => {
  const totalArbitrage = bookmakers.reduce((sum, bm) => sum + 1 / bm.odds, 0);
  return (1 / totalArbitrage) * 100;
};

// Calcular métricas completas
export const calculateMetrics = (bookmakers: Bookmaker[]): Metrics => {
  // Converter stakes e odds para número
  const safeBookmakers = bookmakers.map((bm) => ({
    ...bm,
    stake: typeof bm.stake === "string" ? parseFloat(bm.stake) : bm.stake,
    odds: typeof bm.odds === "string" ? parseFloat(bm.odds) : bm.odds,
  }));

  // Log para debug
  console.log(
    "[CALC] Bookmakers para cálculo:",
    safeBookmakers.map((bm) => ({
      name: bm.name,
      stake: bm.stake,
      odds: bm.odds,
    }))
  );

  const totalStake = safeBookmakers.reduce((sum, bm) => sum + bm.stake, 0);
  console.log("[CALC] Total stake calculado:", totalStake);
  // Cálculo correto para arbitragem de 2 ou mais vias:
  // Para cada aposta: lucro = payout - totalStake
  const profits = safeBookmakers.map((bm) => bm.stake * bm.odds - totalStake);
  const totalProfit = Math.min(...profits);
  const profitPercentage = (totalProfit / totalStake) * 100;
  const roi = (totalProfit / totalStake) * 100;
  // Percentual de arbitragem: (1 / soma(1/odds)) * 100
  const totalArbitrage = safeBookmakers.reduce(
    (sum, bm) => sum + 1 / bm.odds,
    0
  );
  const arbitragePercentage = (1 / totalArbitrage) * 100;
  return {
    totalProfit,
    profitPercentage,
    roi,
    totalStake,
    arbitragePercentage,
  };
};

// Calcular lucro garantido
export const calculateGuaranteedProfit = (bookmakers: Bookmaker[]): number => {
  if (!isValidArbitrage(bookmakers)) {
    return 0;
  }

  const totalStake = bookmakers.reduce((sum, bm) => sum + bm.stake, 0);
  const payouts = bookmakers.map((bm) => bm.stake * bm.odds);
  const minPayout = Math.min(...payouts);

  return minPayout - totalStake;
};

// Calcular stake ótimo para cada casa
export const calculateOptimalStakesForProfit = (
  bookmakers: Bookmaker[],
  targetProfit: number
): Bookmaker[] => {
  const totalArbitrage = bookmakers.reduce((sum, bm) => sum + 1 / bm.odds, 0);

  if (totalArbitrage >= 1) {
    throw new Error("Não é uma arbitragem válida");
  }

  const requiredInvestment = targetProfit / (1 - totalArbitrage);

  return bookmakers.map((bm) => ({
    ...bm,
    stake: (requiredInvestment * (1 / bm.odds)) / totalArbitrage,
    profit: ((requiredInvestment * (1 / bm.odds)) / totalArbitrage) * bm.odds,
  }));
};

// Função para validar e calcular arbitragem com dados reais
export const validateAndCalculateArbitrage = (bookmakers: Bookmaker[]) => {
  // Converter stakes e odds para número
  const safeBookmakers = bookmakers.map((bm) => ({
    ...bm,
    stake: typeof bm.stake === "string" ? parseFloat(bm.stake) : bm.stake,
    odds: typeof bm.odds === "string" ? parseFloat(bm.odds) : bm.odds,
  }));
  const totalStake = safeBookmakers.reduce((sum, bm) => sum + bm.stake, 0);
  const profits = safeBookmakers.map((bm) => bm.stake * bm.odds - totalStake);
  // const totalProfit = Math.min(...profits);
  const metrics = calculateMetrics(safeBookmakers);
  const allPositive = profits.every((p) => p > 0);
  if (!allPositive) {
    return {
      isValid: false,
      message: `Não é uma arbitragem válida. Pelo menos um cenário tem prejuízo. Lucros: [${profits
        .map((p) => p.toFixed(2))
        .join(", ")}]`,
      metrics,
    };
  }
  return {
    isValid: true,
    message: `Arbitragem válida! Lucro garantido: ${formatCurrency(
      metrics.totalProfit
    )}`,
    metrics,
  };
};
