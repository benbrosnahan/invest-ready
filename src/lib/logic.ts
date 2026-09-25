import type { QuizAnswers, QuizResult, Fund, HYSAAccount } from "@/types";

const HYSA_ACCOUNTS: HYSAAccount[] = [
  {
    name: "Wealthfront Cash",
    apy: "3.30%",
    note: "No minimum deposit, no fees.",
    url: "https://www.wealthfront.com",
  },
  {
    name: "Marcus by Goldman Sachs",
    apy: "3.40%",
    note: "No minimum deposit, no fees.",
    url: "https://www.marcus.com/us/en",
  },
  {
    name: "SoFi Savings",
    apy: "3.10%",
    note: "Higher rate available with direct deposit.",
    url: "https://www.sofi.com/banking/high-yield-savings-account",
  },
];

const ALL_FUNDS: Record<string, Fund> = {
  VTI: {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    description:
      "Owns a slice of every major US company, from large names like Apple and Amazon down to smaller companies. One fund, broad coverage.",
    fee: "0.03%/yr",
    role: "primary",
    provider: "Vanguard",
  },
  VT: {
    ticker: "VT",
    name: "Vanguard Total World Stock ETF",
    description:
      "Owns stocks from every country in one fund: US, Europe, Asia, and emerging markets. Maximum global diversification, one holding.",
    fee: "0.07%/yr",
    role: "primary",
    provider: "Vanguard",
  },
  VXUS: {
    ticker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    description:
      "International stocks only, covering markets outside the US. Pairs with VTI to give you global coverage.",
    fee: "0.07%/yr",
    role: "supporting",
    provider: "Vanguard",
  },
  BND: {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    description:
      "US government and corporate bonds. More stable than stocks with lower but more predictable returns. Reduces overall portfolio swings.",
    fee: "0.03%/yr",
    role: "bond",
    provider: "Vanguard",
  },
  FSKAX: {
    ticker: "FSKAX",
    name: "Fidelity Total Market Index Fund",
    description:
      "Fidelity's equivalent of VTI. Covers the entire US stock market. Available only if you open an account at Fidelity.",
    fee: "0.015%/yr",
    role: "primary",
    provider: "Fidelity",
  },
};

const ROTH_IRA_LINKS = [
  { label: "Open at Fidelity", url: "https://www.fidelity.com/retirement-ira/roth-ira" },
  { label: "Open at Vanguard", url: "https://investor.vanguard.com/accounts-plans/iras/roth-ira" },
  { label: "Open at Schwab", url: "https://www.schwab.com/ira/roth-ira" },
];

const BROKERAGE_LINKS = [
  { label: "Open at Fidelity", url: "https://www.fidelity.com/open-account/overview" },
  { label: "Open at Vanguard", url: "https://investor.vanguard.com/accounts-plans/brokerage-accounts" },
  { label: "Open at Schwab", url: "https://www.schwab.com/brokerage" },
];

export function getResult(answers: Partial<QuizAnswers>): QuizResult {
  const { income, emergency, debt, goal, risk } = answers;

  if (income === "none") {
    return {
      type: "gate",
      gate: "no_income",
      headline: "Not quite yet.",
      message:
        "Investing works best when you have steady income coming in. Without it, you'd be investing money you might need back soon, which often means selling at the wrong time.",
      actionTitle: "What to do in the meantime",
      actionMessage:
        "If you have any savings sitting in a regular checking account, move them to a High-Yield Savings Account (HYSA). It earns interest automatically while you get settled, with no risk and no lock-up period.",
    };
  }

  if (emergency === "none" || emergency === "partial") {
    return {
      type: "gate",
      gate: "no_emergency",
      headline: "Almost there.",
      message:
        "Before investing, it's worth building at least one month of expenses as a cushion. Without it, an unexpected bill could force you to sell investments at a bad time, which often locks in losses.",
      actionTitle: "Your next move",
      actionMessage:
        "Open a High-Yield Savings Account and build that one-month cushion there. It earns interest while you save, and once it's funded, you'll be in a much stronger position to invest.",
    };
  }

  if (debt === "high_interest") {
    return {
      type: "gate",
      gate: "high_debt",
      headline: "Pay off high-interest debt first.",
      message:
        "If your credit card charges 20 to 25% interest, paying off $1,000 of that balance is the same as earning a guaranteed 20 to 25% return on $1,000. Almost no investment can reliably beat that. Paying off high-interest debt is one of the best financial moves you can make.",
      actionTitle: "Once the debt is gone",
      actionMessage:
        "Come back here and run through the quiz again. Once high-interest debt is cleared, you'll be in a strong position to start investing and your money will actually be working for you.",
    };
  }

  if (goal === "soon") {
    return {
      type: "plan",
      accountType: "hysa",
      accountLabel: "High-Yield Savings Account",
      accountReason:
        "Since you may need this money within the next couple of years, a High-Yield Savings Account is the right fit. Short-term investing may not provide returns that justify the risk. A HYSA keeps your money accessible and still earning interest.",
      funds: [],
      allocationLabel: "",
      hysa: HYSA_ACCOUNTS,
      openLinks: [],
    };
  }

  if (goal === "retirement") {
    const funds = getFundsForRisk(risk, "retirement");
    return {
      type: "plan",
      accountType: "roth_ira",
      accountLabel: "Roth IRA",
      accountReason:
        "A Roth IRA is ideal for retirement savings when you're young. You invest after-tax money now (when your tax rate is low) and pay zero taxes on all the growth when you withdraw it in retirement. The 2026 annual contribution limit is $7,500.",
      funds,
      allocationLabel: getAllocationLabel(risk, "retirement"),
      openLinks: ROTH_IRA_LINKS,
    };
  }

  const funds = getFundsForRisk(risk, goal ?? "wealth");
  return {
    type: "plan",
    accountType: "brokerage",
    accountLabel: "Taxable Brokerage Account",
    accountReason:
      goal === "big_goal"
        ? "A taxable brokerage account gives you the flexibility to invest toward a specific goal without locking up your money. There are no penalties for withdrawing when you need it."
        : "A taxable brokerage account is a flexible starting point. No contribution limits, no penalties for withdrawing, and your money stays invested and growing.",
    funds,
    allocationLabel: getAllocationLabel(risk, goal ?? "wealth"),
    openLinks: BROKERAGE_LINKS,
  };
}

function getFundsForRisk(risk: RiskAnswer | undefined, goal: string): Fund[] {
  if (risk === "conservative") {
    return [ALL_FUNDS.BND, ALL_FUNDS.VTI];
  }
  if (risk === "growth") {
    return [ALL_FUNDS.VTI, ALL_FUNDS.VXUS, ALL_FUNDS.VT];
  }
  if (goal === "retirement") {
    return [ALL_FUNDS.VTI, ALL_FUNDS.FSKAX, ALL_FUNDS.VT];
  }
  return [ALL_FUNDS.VTI, ALL_FUNDS.VT, ALL_FUNDS.BND];
}

type RiskAnswer = "conservative" | "moderate" | "growth";

function getAllocationLabel(risk: RiskAnswer | undefined, goal: string): string {
  if (risk === "conservative") {
    return "A bond-heavy mix keeps your portfolio stable. Something like 60% BND and 40% VTI, or adjust to your comfort level.";
  }
  if (risk === "growth") {
    return "An equity-heavy approach maximizes long-term growth. Something like 80% VTI and 20% VXUS, or simplify with 100% VT.";
  }
  if (goal === "retirement") {
    return "For retirement decades away, broad US or global equity funds are a strong core. Something like 100% VTI or 100% VT to keep it simple.";
  }
  return "A balanced mix works well here. Something like 80% VTI and 20% BND, or swap VTI for VT if you want global exposure.";
}
