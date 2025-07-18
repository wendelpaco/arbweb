// Formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatação de percentual
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Formatação de data
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Formatação de data curta
export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Formatação de número
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Formatação de odds
export const formatOdds = (odds: number): string => {
  return formatNumber(odds, 2);
};

// Formatação de stake
export const formatStake = (stake: number): string => {
  return formatCurrency(stake);
};

// Formatação de lucro
export const formatProfit = (profit: number): string => {
  const formatted = formatCurrency(Math.abs(profit));
  return profit >= 0 ? `+${formatted}` : `-${formatted}`;
};

// Formatação de ROI
export const formatROI = (roi: number): string => {
  const formatted = formatPercentage(roi);
  return roi >= 0 ? `+${formatted}` : `-${formatted}`;
};

// Formatação de tempo relativo
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} dias atrás`;
  }

  return formatDateShort(date);
};

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Formatação de nome de arquivo
export const formatFileName = (fileName: string, maxLength = 30): string => {
  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.split(".").pop();
  const name = fileName.substring(0, fileName.lastIndexOf("."));
  const truncatedName = name.substring(0, maxLength - extension!.length - 4);

  return `${truncatedName}...${extension}`;
};
