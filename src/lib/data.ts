// Every figure the tool shows that comes from outside it, with where it came from and when it was read.
// When a figure changes, change it here and in the date beside it. Sources are listed in audits/REPORT.md.

import type { Fund, SavingsAccount } from "@/types";

/**
 * Savings rates, read from each provider's own page on 15 November 2026.
 * Wealthfront: 3.55% base APY as of 11/13/2026 (a 3-month boost for new clients is extra and left out).
 * Marcus: 3.50% APY as of 11/15/2026, no fees, no minimum deposit.
 * SoFi: 3.30% APY with eligible direct deposit or $5,000 in qualifying deposits every 31 days, 0.80% otherwise
 * (SoFi Bank rate sheet effective 10/20/2026, Table 5).
 */
export const SAVINGS_CHECKED = "November 15, 2026";

export const SAVINGS_ACCOUNTS: SavingsAccount[] = [
  {
    name: "Wealthfront Cash",
    apy: "3.55%",
    note: "No account fees. Insured through partner banks.",
    url: "https://www.wealthfront.com/cash",
  },
  {
    name: "Marcus by Goldman Sachs",
    apy: "3.50%",
    note: "No fees, no minimum deposit.",
    url: "https://www.marcus.com/us/en/savings/high-yield-savings",
  },
  {
    name: "SoFi Savings",
    apy: "3.30%",
    note: "Needs direct deposit or $5,000 in deposits every 31 days. Otherwise 0.80%.",
    url: "https://www.sofi.com/banking/high-yield-savings-account/",
  },
];

/** Expense ratios from each fund's fact sheet as of 30 September 2026 (Vanguard) and Fidelity's fund lineup. */
export const FEES_CHECKED = "September 30, 2026";

export const FUNDS = {
  VTI: {
    ticker: "VTI",
    name: "Vanguard Morningstar Total Stock Market ETF",
    description: "About 3,500 US companies, large to small, in one fund.",
    fee: "0.03%",
    role: "core",
  },
  FSKAX: {
    ticker: "FSKAX",
    name: "Fidelity Total Market Index Fund",
    description: "Fidelity's version of VTI. A mutual fund with no minimum, easiest to buy at Fidelity.",
    fee: "0.015%",
    role: "core",
  },
  VT: {
    ticker: "VT",
    name: "Vanguard Total World Stock ETF",
    description: "About 10,000 companies in more than 47 countries, the US included.",
    fee: "0.06%",
    role: "core",
  },
  VXUS: {
    ticker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    description: "Companies outside the US. Pairs with VTI to cover the world.",
    fee: "0.05%",
    role: "world",
  },
  BND: {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    description:
      "US government and company bonds. Usually steadier than stocks, but it can lose value: it averaged -0.64% a year over the 5 years to September 2026.",
    fee: "0.03%",
    role: "bonds",
  },
} satisfies Record<string, Fund>;

export const ROTH_IRA_LINKS = [
  { label: "Open at Fidelity", url: "https://www.fidelity.com/retirement-ira/roth-ira" },
  { label: "Open at Vanguard", url: "https://investor.vanguard.com/accounts-plans/iras/roth-ira" },
  { label: "Open at Robinhood", url: "https://robinhood.com/us/en/about/retirement/" },
  { label: "Open at Schwab", url: "https://www.schwab.com/ira/roth-ira" },
];

export const BROKERAGE_LINKS = [
  { label: "Open at Fidelity", url: "https://www.fidelity.com/open-account/overview" },
  { label: "Open at Vanguard", url: "https://investor.vanguard.com/accounts-plans/brokerage-accounts" },
  { label: "Open at Robinhood", url: "https://robinhood.com/us/en/invest/" },
  { label: "Open at Schwab", url: "https://www.schwab.com/brokerage" },
];

/**
 * IRA limit for 2026: $7,500, or taxable compensation if less (IRS IR-2025-111, Notice 2025-67). Notice 2026-66
 * keeps $7,500 for 2027. An excess contribution is taxed 6% a year until it is withdrawn (IRS Publication 590-A).
 */
export const IRA_LIMIT_YEAR = 2026;
export const IRA_LIMIT = "$7,500";

/** The line between low and high interest that the debt question asks about. */
export const HIGH_RATE_LINE = "8%";

/** Federal Direct loans for undergraduates first paid out July 1, 2026 to June 30, 2027 (FSA, June 4, 2026). */
export const UNDERGRAD_LOAN_RATE = "6.52%";

/** Credit card plans, accounts assessed interest, Q3 2026 (Federal Reserve G.19, November 6, 2026): 22.36%. */
export const CARD_RATE = "22%";

/** Growth table assumption: 7% a year, close to the S&P 500's 1928-2025 average after inflation (6.8%). */
export const ASSUMED_RETURN = 0.07;
