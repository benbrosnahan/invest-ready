// The five questions, in the order money should go. Copy lives here so the quiz, the result's ladder and the
// tests read the same words.

import { CARD_RATE, HIGH_RATE_LINE, UNDERGRAD_LOAN_RATE } from "@/lib/data";
import type { Question, QuizAnswers } from "@/types";

export interface Option<V extends string = string> {
  value: V;
  label: string;
  description: string;
}

export interface QuestionConfig {
  id: Question;
  /** The rung's name on the ladder: what this question checks. */
  rung: string;
  /** One word for the progress ladder. */
  short: string;
  title: string;
  hint: string;
  options: Option[];
}

export const QUESTIONS: QuestionConfig[] = [
  {
    id: "income",
    rung: "Money coming in",
    short: "Income",
    title: "Do you have a regular source of income right now?",
    hint: "Part-time work and work-study count.",
    options: [
      { value: "consistent", label: "Yes, it's consistent", description: "A paycheck, work-study, or a grad stipend" },
      { value: "variable", label: "Yes, but it varies", description: "Gig work, freelance, part-time, or seasonal" },
      {
        value: "unearned",
        label: "Only from family or aid",
        description: "An allowance, scholarships, or grants, but no pay from work",
      },
      { value: "none", label: "Not right now", description: "Between jobs or not earning" },
    ],
  },
  {
    id: "emergency",
    rung: "A cushion",
    short: "Cushion",
    title: "Do you have a cushion saved?",
    hint: "Money that would cover rent, food, and bills if something went wrong.",
    options: [
      {
        value: "funded",
        label: "Yes, I have at least one month covered",
        description: "Enough for a month of rent, food, and bills",
      },
      {
        value: "partial",
        label: "I have some savings, but not a full month",
        description: "Something saved, but it would not last a month",
      },
      { value: "none", label: "No savings cushion yet", description: "Starting from zero or close to it" },
    ],
  },
  {
    id: "debt",
    rung: `No debt above ${HIGH_RATE_LINE}`,
    short: "Debt",
    title: `Do you owe anything above ${HIGH_RATE_LINE} interest?`,
    hint: `Credit cards average about ${CARD_RATE}. Paying that off beats what investing usually earns.`,
    options: [
      {
        value: "high_interest",
        label: `Yes, some above ${HIGH_RATE_LINE}`,
        description: "A card balance I carry, or a private student loan or personal loan above 8%",
      },
      {
        value: "low_interest",
        label: `Only debt under ${HIGH_RATE_LINE}`,
        description: `Like federal undergrad loans, ${UNDERGRAD_LOAN_RATE} for 2026-27`,
      },
      { value: "none", label: "No debt", description: "Nothing owed" },
    ],
  },
  {
    id: "goal",
    rung: "Time to grow",
    short: "Goal",
    title: "When will you need this money?",
    hint: "Money you need soon should not ride the stock market.",
    options: [
      { value: "retirement", label: "Retirement", description: "I won't touch it for decades" },
      { value: "big_goal", label: "A big goal", description: "A house, a car, or something else 5 to 10 years away" },
      { value: "wealth", label: "Growing my wealth", description: "No set goal, and I won't need it for 5 years or more" },
      { value: "soon", label: "Might need it within 5 years", description: "Something coming up, or I'm not sure when" },
    ],
  },
  {
    id: "risk",
    rung: "A mix you can hold",
    short: "Risk",
    title: "If your investments dropped 10% next month, what would you do?",
    hint: "There is no wrong answer. This sets how much of your mix is stocks.",
    options: [
      {
        value: "conservative",
        label: "Pull it out. I can't afford to lose that.",
        description: "Protecting what I have matters most",
      },
      {
        value: "moderate",
        label: "Leave it and wait for it to recover.",
        description: "I want growth and can sit through some swings",
      },
      {
        value: "growth",
        label: "Put more in. A dip is a chance to buy.",
        description: "Long-term growth matters most to me",
      },
    ],
  },
];

export const questionFor = (id: Question) => QUESTIONS.find((q) => q.id === id)!;

/** How each answer reads on the result's ladder: short, in the student's terms. */
export const ANSWER_SUMMARY: { [K in Question]: Record<QuizAnswers[K], string> } = {
  income: {
    consistent: "Steady pay",
    variable: "Pay that varies",
    unearned: "Family or aid, no pay from work",
    none: "No income right now",
  },
  emergency: {
    funded: "A month or more saved",
    partial: "Less than a month saved",
    none: "No cushion yet",
  },
  debt: {
    none: "No debt",
    low_interest: `Only debt under ${HIGH_RATE_LINE}`,
    high_interest: `Debt above ${HIGH_RATE_LINE}`,
  },
  goal: {
    retirement: "Retirement",
    big_goal: "A goal 5 to 10 years away",
    wealth: "No set goal, 5 years or more",
    soon: "Might need it within 5 years",
  },
  risk: {
    conservative: "Would pull out after a drop",
    moderate: "Would wait out a drop",
    growth: "Would buy more after a drop",
  },
};
