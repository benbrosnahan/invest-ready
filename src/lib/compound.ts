import { ASSUMED_RETURN } from "@/lib/data";

// The monthly rate that compounds to the assumed annual return. 0.07 / 12 would compound to 7.23% a year and
// overstate 40 years of saving by about 6% (audits/REPORT.md, MONEY-07).
const MONTHLY_RATE = Math.pow(1 + ASSUMED_RETURN, 1 / 12) - 1;

/** Value after `years` of the same deposit at the end of every month. */
export function futureValue(monthlyContribution: number, years: number): number {
  if (!(monthlyContribution > 0) || !(years > 0)) return 0;
  const n = years * 12;
  return monthlyContribution * ((Math.pow(1 + MONTHLY_RATE, n) - 1) / MONTHLY_RATE);
}

export const GROWTH_YEARS = [10, 20, 30, 40];

/** Largest monthly amount the table takes, so a stray paste cannot overflow the layout. */
export const MAX_MONTHLY = 99_999;

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function formatDollars(n: number): string {
  return USD.format(Math.round(n));
}
