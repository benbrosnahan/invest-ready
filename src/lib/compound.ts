const ANNUAL_RETURN = 0.07;
const MONTHLY_RATE = ANNUAL_RETURN / 12;

export function futureValue(monthlyContribution: number, years: number): number {
  const n = years * 12;
  if (monthlyContribution <= 0) return 0;
  return monthlyContribution * ((Math.pow(1 + MONTHLY_RATE, n) - 1) / MONTHLY_RATE);
}

export const GROWTH_YEARS = [10, 20, 30, 40];

export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    return "$" + (n / 1_000_000).toFixed(2) + "M";
  }
  if (n >= 1_000) {
    return "$" + (n / 1_000).toFixed(0) + "K";
  }
  return "$" + Math.round(n).toLocaleString();
}

export function formatFull(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}
