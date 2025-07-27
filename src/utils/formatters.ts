export const formatNumber = (num: number): string => {
  if (num >= 1e33) return `${(num / 1e33).toFixed(2)} Decillion`;
  if (num >= 1e30) return `${(num / 1e30).toFixed(2)} Nonillion`;
  if (num >= 1e27) return `${(num / 1e27).toFixed(2)} Octillion`;
  if (num >= 1e24) return `${(num / 1e24).toFixed(2)} Septillion`;
  if (num >= 1e21) return `${(num / 1e21).toFixed(2)} Sextillion`;
  if (num >= 1e18) return `${(num / 1e18).toFixed(2)} Quintillion`;
  if (num >= 1e15) return `${(num / 1e15).toFixed(2)} Quadrillion`;
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)} Trillion`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)} Billion`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)} Million`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatBitBux = (num: number): string => {
  return `${formatNumber(num)} BB`;
};