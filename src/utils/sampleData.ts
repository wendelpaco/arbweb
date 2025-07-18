import { ArbitrageData } from "../types";

export const generateSampleArbitrages = (): ArbitrageData[] => {
  const sampleArbitrages: ArbitrageData[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      match: {
        team1: "Flamengo",
        team2: "Palmeiras",
        sport: "Futebol",
        competition: "Brasileirão",
      },
      bookmakers: [
        { name: "Bet365", odds: 1.85, betType: "Casa", stake: 100, profit: 85 },
        {
          name: "William Hill",
          odds: 2.1,
          betType: "Fora",
          stake: 88.1,
          profit: 96.9,
        },
      ],
      metrics: {
        totalProfit: 81.9,
        profitPercentage: 4.3,
        roi: 4.3,
        totalStake: 188.1,
        arbitragePercentage: 95.7,
      },
      imageUrl: "",
      status: "processed",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      match: {
        team1: "Santos",
        team2: "Corinthians",
        sport: "Futebol",
        competition: "Brasileirão",
      },
      bookmakers: [
        { name: "Unibet", odds: 1.95, betType: "Casa", stake: 100, profit: 95 },
        {
          name: "Betfair",
          odds: 2.05,
          betType: "Fora",
          stake: 95.1,
          profit: 99.7,
        },
      ],
      metrics: {
        totalProfit: 94.7,
        profitPercentage: 4.8,
        roi: 4.8,
        totalStake: 195.1,
        arbitragePercentage: 95.2,
      },
      imageUrl: "",
      status: "processed",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      match: {
        team1: "Lakers",
        team2: "Warriors",
        sport: "Basquete",
        competition: "NBA",
      },
      bookmakers: [
        { name: "Bet365", odds: 1.75, betType: "Casa", stake: 100, profit: 75 },
        {
          name: "William Hill",
          odds: 2.25,
          betType: "Fora",
          stake: 77.8,
          profit: 87.5,
        },
      ],
      metrics: {
        totalProfit: 62.5,
        profitPercentage: 3.5,
        roi: 3.5,
        totalStake: 177.8,
        arbitragePercentage: 96.5,
      },
      imageUrl: "",
      status: "processed",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      match: {
        team1: "Nadal",
        team2: "Djokovic",
        sport: "Tênis",
        competition: "Wimbledon",
      },
      bookmakers: [
        { name: "Bet365", odds: 1.9, betType: "Casa", stake: 100, profit: 90 },
        {
          name: "Unibet",
          odds: 2.15,
          betType: "Fora",
          stake: 88.4,
          profit: 101.6,
        },
      ],
      metrics: {
        totalProfit: 91.6,
        profitPercentage: 4.8,
        roi: 4.8,
        totalStake: 188.4,
        arbitragePercentage: 95.2,
      },
      imageUrl: "",
      status: "processed",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      match: {
        team1: "Brasil",
        team2: "Argentina",
        sport: "Futebol",
        competition: "Copa América",
      },
      bookmakers: [
        {
          name: "William Hill",
          odds: 1.8,
          betType: "Casa",
          stake: 100,
          profit: 80,
        },
        {
          name: "Betfair",
          odds: 2.2,
          betType: "Fora",
          stake: 81.8,
          profit: 98.2,
        },
      ],
      metrics: {
        totalProfit: 78.2,
        profitPercentage: 4.3,
        roi: 4.3,
        totalStake: 181.8,
        arbitragePercentage: 95.7,
      },
      imageUrl: "",
      status: "processed",
    },
  ];

  return sampleArbitrages;
};

export const initializeSampleData = () => {
  // Verifica se já existem dados no localStorage
  const existingData = localStorage.getItem("arbitrage-storage");

  if (!existingData) {
    const sampleData = generateSampleArbitrages();

    // Salva os dados de exemplo no localStorage
    const storageData = {
      state: {
        arbitrages: sampleData,
        dashboardMetrics: {
          totalProfit: 408.9,
          totalArbitrages: 5,
          averageRoi: 4.34,
          successRate: 100,
          bestBookmaker: "Bet365",
          mostProfitableSport: "Futebol",
          profitByPeriod: [],
          bookmakerDistribution: [],
          sportDistribution: [],
        },
        isLoading: false,
        error: null,
      },
      version: 0,
    };

    localStorage.setItem("arbitrage-storage", JSON.stringify(storageData));
    console.log("Dados de exemplo inicializados no localStorage");
  }
};
