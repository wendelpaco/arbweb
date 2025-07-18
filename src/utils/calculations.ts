import { Bookmaker, Metrics } from "../types";

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
  // Verificar se é uma arbitragem válida
  if (!isValidArbitrage(bookmakers)) {
    return {
      totalProfit: 0,
      profitPercentage: 0,
      roi: 0,
      totalStake: bookmakers.reduce((sum, bm) => sum + bm.stake, 0),
      arbitragePercentage: 0,
    };
  }

  const totalStake = bookmakers.reduce((sum, bm) => sum + bm.stake, 0);

  // Calcular o payout mínimo (garantido)
  const payouts = bookmakers.map((bm) => bm.stake * bm.odds);
  const minPayout = Math.min(...payouts);

  // O lucro garantido é o payout mínimo menos o stake total
  const totalProfit = minPayout - totalStake;

  const profitPercentage = calculateProfitPercentage(totalProfit, totalStake);
  const roi = calculateROI(totalProfit, totalStake);
  const arbitragePercentage = calculateArbitragePercentage(bookmakers);

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
  const totalArbitrage = bookmakers.reduce((sum, bm) => sum + 1 / bm.odds, 0);
  const isValid = totalArbitrage < 1;

  if (!isValid) {
    return {
      isValid: false,
      message: `Não é uma arbitragem válida. Soma das probabilidades: ${(
        totalArbitrage * 100
      ).toFixed(2)}%`,
      metrics: {
        totalProfit: 0,
        profitPercentage: 0,
        roi: 0,
        totalStake: bookmakers.reduce((sum, bm) => sum + bm.stake, 0),
        arbitragePercentage: 0,
      },
    };
  }

  const metrics = calculateMetrics(bookmakers);

  return {
    isValid: true,
    message: `Arbitragem válida! Lucro garantido: ${metrics.totalProfit.toFixed(
      2
    )}`,
    metrics,
  };
};
