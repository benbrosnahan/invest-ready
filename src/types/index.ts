export type IncomeAnswer = "consistent" | "variable" | "none";
export type EmergencyAnswer = "funded" | "partial" | "none";
export type DebtAnswer = "high_interest" | "low_interest" | "none";
export type GoalAnswer = "retirement" | "big_goal" | "wealth" | "soon";
export type RiskAnswer = "conservative" | "moderate" | "growth";

export interface QuizAnswers {
  income: IncomeAnswer;
  emergency: EmergencyAnswer;
  debt: DebtAnswer;
  goal: GoalAnswer;
  risk: RiskAnswer;
}

export interface QuizState {
  step: number;
  direction: number;
  answers: Partial<QuizAnswers>;
}

export const TOTAL_STEPS = 5;

export const INITIAL_ANSWERS: Partial<QuizAnswers> = {};

export interface Fund {
  ticker: string;
  name: string;
  description: string;
  fee: string;
  role: "primary" | "supporting" | "bond";
  provider: string;
}

export interface GateResult {
  type: "gate";
  gate: "no_income" | "no_emergency" | "high_debt";
  headline: string;
  message: string;
  actionTitle: string;
  actionMessage: string;
}

export interface HYSAAccount {
  name: string;
  apy: string;
  note: string;
  url: string;
}

export interface PlanResult {
  type: "plan";
  accountType: "roth_ira" | "brokerage" | "hysa";
  accountLabel: string;
  accountReason: string;
  funds: Fund[];
  allocationLabel: string;
  hysa?: HYSAAccount[];
  openLinks: { label: string; url: string }[];
}

export type QuizResult = GateResult | PlanResult;
