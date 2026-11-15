// "unearned" is money coming in that is not pay from work: family support, scholarships, grants. It can be
// invested, but it cannot go into a Roth IRA, which takes only taxable compensation (IRS Publication 590-A).
export type IncomeAnswer = "consistent" | "variable" | "unearned" | "none";
export type EmergencyAnswer = "funded" | "partial" | "none";
export type DebtAnswer = "high_interest" | "low_interest" | "none";
export type GoalAnswer = "retirement" | "big_goal" | "wealth" | "soon";
export type RiskAnswer = "conservative" | "moderate" | "growth";

export interface QuizAnswers {
  income: IncomeAnswer;
  debt: DebtAnswer;
  emergency: EmergencyAnswer;
  goal: GoalAnswer;
  risk: RiskAnswer;
}

export type Answers = Partial<QuizAnswers>;
export type Question = keyof QuizAnswers;

/**
 * The order of the questions, which is also the order money should go. Costly debt comes before the cushion, as the
 * SEC's roadmap orders it ("After paying off credit cards or other high interest debt", an emergency fund), so a
 * student without savings is never sent away before card debt is mentioned (audits/REPORT.md, MONEY-17).
 */
export const QUESTION_ORDER: Question[] = ["income", "debt", "emergency", "goal", "risk"];
export const TOTAL_STEPS = QUESTION_ORDER.length;

export interface Fund {
  ticker: string;
  name: string;
  description: string;
  /** Expense ratio, as printed: "0.03%". */
  fee: string;
  role: "core" | "world" | "bonds";
}

export interface SavingsAccount {
  name: string;
  apy: string;
  note: string;
  url: string;
}

export interface GateResult {
  type: "gate";
  gate: "no_income" | "high_debt" | "no_emergency";
  headline: string;
  message: string;
  /** The next step as a short action, the heading of the next-step card. */
  nextTitle: string;
  nextStep: string;
  /** A second line under the next step, when one matters. */
  aside?: string;
}

export interface PlanResult {
  type: "plan";
  accountType: "roth_ira" | "brokerage" | "hysa";
  headline: string;
  message: string;
  accountLabel: string;
  accountReason: string;
  /** A rule the student must know before acting. Shown on the result itself, never folded away. */
  rule?: string;
  funds: Fund[];
  mix: string;
  openLinks: { label: string; url: string }[];
}

export type QuizResult = GateResult | PlanResult;
