export function formatINR(amount?: number | string | null, maxFractionDigits: number = 0): string {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: maxFractionDigits });
}

export function formatNumber(amount?: number | string | null, maxFractionDigits: number = 0): string {
  if (amount === undefined || amount === null || amount === '') return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: maxFractionDigits });
}
