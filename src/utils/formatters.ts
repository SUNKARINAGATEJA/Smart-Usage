export const formatINR = (amount: number): string => {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = absVal.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}₹${formatted}`;
};
