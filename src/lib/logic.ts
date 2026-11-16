// The readiness rules. The product lives here: the tool must be willing to answer "not yet", and it stops at the
// first step that is not in place. Every figure it quotes comes from src/lib/data.ts.

import {
  BROKERAGE_LINKS,
  CARD_RATE,
  FUNDS,
  HIGH_RATE_LINE,
  IRA_LIMIT,
  IRA_LIMIT_YEAR,
  ROTH_IRA_LINKS,
} from "@/lib/data";
import {
  QUESTION_ORDER,
  type Answers,
  type Fund,
  type GoalAnswer,
  type Question,
  type QuizAnswers,
  type QuizResult,
  type RiskAnswer,
} from "@/types";

const VALID: { [K in Question]: readonly QuizAnswers[K][] } = {
  income: ["consistent", "variable", "unearned", "none"],
  debt: ["high_interest", "low_interest", "none"],
  emergency: ["funded", "partial", "none"],
  goal: ["retirement", "big_goal", "wealth", "soon"],
  risk: ["conservative", "moderate", "growth"],
};

/** Keeps only known answers, so a stale or edited sessionStorage value can never pick a result. */
export function cleanAnswers(raw: unknown): Answers {
  const out: Answers = {};
  if (!raw || typeof raw !== "object") return out;
  for (const q of QUESTION_ORDER) {
    const v = (raw as Record<string, unknown>)[q];
    if ((VALID[q] as readonly unknown[]).includes(v)) (out as Record<string, unknown>)[q] = v;
  }
  return out;
}

/**
 * True when this answer ends the quiz: a step that is not in place, a short-term goal, or the last question.
 * Debt is asked before the cushion so it is always mentioned, but it never ends the quiz on its own: a one-month
 * cushion comes first (Ben, 2026-11-16), so the cushion question decides what a student with costly debt hears.
 */
export function endsQuiz<K extends Question>(question: K, value: QuizAnswers[K], answers: Answers = {}): boolean {
  switch (question) {
    case "income":
      return value === "none";
    case "debt":
      return false;
    case "emergency":
      return value !== "funded" || answers.debt === "high_interest";
    case "goal":
      return value === "soon";
    default:
      return true;
  }
}

/** The questions that were answered on the way to the result, in order. */
export function answeredPath(answers: Answers): Question[] {
  const path: Question[] = [];
  for (const q of QUESTION_ORDER) {
    const v = answers[q];
    if (v === undefined) break;
    path.push(q);
    if (endsQuiz(q, v as never, answers)) break;
  }
  return path;
}

/**
 * The result for a set of answers, or null when a question on the way to a result was never answered. A missing
 * answer is never read as a good one: an unanswered debt question must not count as "no debt".
 */
export function getResult(answers: Answers): QuizResult | null {
  const { income, emergency, debt, goal, risk } = answers;

  if (income === undefined) return null;
  if (income === "none") {
    return {
      type: "gate",
      gate: "no_income",
      headline: "Not yet. Income comes first.",
      message:
        "Without money coming in, what you invest may be money you need back soon, and you could have to sell at a bad time.",
      nextTitle: "Keep your savings safe and earning",
      nextStep:
        "Keep any savings in a high-yield savings account. It earns interest and does not swing with the market.",
      aside: "Check that the account is FDIC insured before you open it.",
    };
  }

  if (debt === undefined) return null;
  if (emergency === undefined) return null;
  const costlyDebt = debt === "high_interest";

  // Ben, 2026-11-16: being able to afford an emergency comes before paying down costly debt. Without a cushion, the
  // next surprise bill goes back on the card. Minimum payments always continue: a missed one costs a late fee and
  // can raise the rate. Once a month is saved, extra money goes to the debt, then to investing.
  if (emergency !== "funded") {
    return {
      type: "gate",
      gate: "no_emergency",
      headline: "Not yet. Build a cushion first.",
      message: costlyDebt
        ? "A month of expenses saved means a surprise bill does not go back on the card. Then the debt can only shrink."
        : "With a month of expenses saved, a surprise bill will not force you to sell investments at a loss.",
      nextTitle: "Save one month of expenses",
      nextStep: costlyDebt
        ? "Keep paying at least the minimum on every card, and put the rest into a high-yield savings account until you have one month of expenses."
        : "Open a high-yield savings account and build up one month of expenses. One month is the minimum to start. Keep going toward three to six months, or more if your pay varies.",
      ...(costlyDebt
        ? {
            aside: `Once you have a month saved, put extra money toward the debt above ${HIGH_RATE_LINE}, highest rate first. Then take the quiz again.`,
          }
        : {}),
    };
  }

  if (costlyDebt) {
    return {
      type: "gate",
      gate: "high_debt",
      headline: "Not yet. Pay off the costly debt first.",
      message: `Paying off a card at ${CARD_RATE} is like earning a sure ${CARD_RATE} on that money. Investing rarely beats that.`,
      nextTitle: "Pay down the costly debt",
      nextStep: `Your cushion is in place. Put extra money toward the highest rate first. When nothing above ${HIGH_RATE_LINE} is left, take the quiz again.`,
      aside: "Keep the cushion where it is. If you dip into it for a surprise, refill it before you go back to the debt.",
    };
  }

  if (goal === undefined) return null;
  if (goal === "soon") {
    return {
      type: "plan",
      accountType: "hysa",
      headline: "Save it for now.",
      message: "You may need this money within 5 years. That is too soon to risk it in stocks.",
      accountLabel: "High-yield savings account",
      accountReason:
        "It keeps the money safe and ready to use, and it still earns interest. Check that it is FDIC insured.",
      funds: [],
      mix: "",
      openLinks: [],
    };
  }

  if (risk === undefined) return null;
  const funds = fundsFor(risk, goal);
  const mix = mixFor(risk, goal);
  const message = "Based on your answers, the basics are in place.";

  if (goal === "retirement" && income !== "unearned") {
    return {
      type: "plan",
      accountType: "roth_ira",
      headline: "You look ready to invest.",
      message,
      accountLabel: "Roth IRA",
      accountReason:
        "You put in money you have already paid tax on, and it can grow tax-free for retirement. With a low tax rate now, that is usually a good trade.",
      rule: `A Roth IRA takes only money you earn from work. For ${IRA_LIMIT_YEAR} you can put in up to ${IRA_LIMIT}, or what you earned from work this year if that is less. Put in more and you owe a 6% tax on the extra every year until you take it out.`,
      funds,
      mix,
      openLinks: ROTH_IRA_LINKS,
    };
  }

  const taxNote =
    "No contribution limit, and no penalty to take money out. You may owe tax on gains when you sell, and it can be worth less when you need it.";
  return {
    type: "plan",
    accountType: "brokerage",
    headline: "You look ready to invest.",
    message,
    accountLabel: "Brokerage account",
    accountReason:
      goal === "retirement"
        ? `A Roth IRA takes only pay from work, and money from family or aid does not count. A brokerage account has no such rule. ${taxNote}`
        : taxNote,
    rule:
      goal === "retirement"
        ? "Once you earn pay from work, a Roth IRA is worth a look for retirement money."
        : undefined,
    funds,
    mix,
    openLinks: BROKERAGE_LINKS,
  };
}

function fundsFor(risk: RiskAnswer, goal: Exclude<GoalAnswer, "soon">): Fund[] {
  if (risk === "conservative") return [FUNDS.BND, FUNDS.VTI];
  if (risk === "growth") return [FUNDS.VTI, FUNDS.VXUS, FUNDS.VT];
  if (goal === "retirement") return [FUNDS.VTI, FUNDS.FSKAX, FUNDS.VT];
  return [FUNDS.VTI, FUNDS.VT, FUNDS.BND];
}

function mixFor(risk: RiskAnswer, goal: Exclude<GoalAnswer, "soon">): string {
  const closer = goal === "big_goal" ? " As your date gets closer, move more into bonds or cash." : "";
  if (risk === "conservative") {
    return `A steadier mix: about 60% BND and 40% VTI. Bonds swing less than stocks, but they can still lose value.${closer}`;
  }
  if (risk === "growth") {
    return `A stock-heavy mix: about 80% VTI and 20% VXUS, or 100% VT in one fund.${closer}`;
  }
  if (goal === "retirement") {
    return "With decades to go, one broad stock fund is enough: 100% VTI, FSKAX at Fidelity, or VT to own the world.";
  }
  return `A balanced mix: about 80% VTI and 20% BND. Swap VTI for VT to add the world.${closer}`;
}

export const ACCOUNT_IN_SENTENCE: Record<"roth_ira" | "brokerage" | "hysa", string> = {
  roth_ira: "a Roth IRA",
  brokerage: "a brokerage account",
  hysa: "a high-yield savings account",
};
