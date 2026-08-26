"use client";

import { useReducer, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "@/components/shared/Nav";
import QuizShell from "@/components/quiz/QuizShell";
import StepIncome from "@/components/quiz/StepIncome";
import StepEmergency from "@/components/quiz/StepEmergency";
import StepDebt from "@/components/quiz/StepDebt";
import StepGoal from "@/components/quiz/StepGoal";
import StepRisk from "@/components/quiz/StepRisk";
import {
  QuizState,
  QuizAnswers,
  INITIAL_ANSWERS,
  TOTAL_STEPS,
  IncomeAnswer,
  EmergencyAnswer,
  DebtAnswer,
  GoalAnswer,
  RiskAnswer,
} from "@/types";
import { getResult } from "@/lib/logic";
import { storage } from "@/lib/utils";

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_ANSWER"; field: keyof QuizAnswers; value: QuizAnswers[keyof QuizAnswers] };

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS), direction: 1 };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 1), direction: -1 };
    case "SET_ANSWER":
      return { ...state, answers: { ...state.answers, [action.field]: action.value } };
    default:
      return state;
  }
}

const initialState: QuizState = { step: 1, direction: 1, answers: INITIAL_ANSWERS };

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -56 : 56, opacity: 0 }),
};

function routeToResults(answers: Partial<QuizAnswers>, router: ReturnType<typeof useRouter>) {
  const result = getResult(answers);
  storage.set("invest-ready-result", JSON.stringify(result));
  router.push("/results");
}

function QuizContent() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = useCallback(
    <K extends keyof QuizAnswers>(field: K, value: QuizAnswers[K]) => {
      dispatch({ type: "SET_ANSWER", field, value });
    },
    []
  );

  const handleIncomeNext = useCallback(
    (income: IncomeAnswer) => {
      if (income === "none") {
        routeToResults({ ...state.answers, income }, router);
      } else {
        dispatch({ type: "NEXT" });
      }
    },
    [state.answers, router]
  );

  const handleEmergencyNext = useCallback(
    (emergency: EmergencyAnswer) => {
      if (emergency === "none" || emergency === "partial") {
        routeToResults({ ...state.answers, emergency }, router);
      } else {
        dispatch({ type: "NEXT" });
      }
    },
    [state.answers, router]
  );

  const handleDebtNext = useCallback(
    (debt: DebtAnswer) => {
      if (debt === "high_interest") {
        routeToResults({ ...state.answers, debt }, router);
      } else {
        dispatch({ type: "NEXT" });
      }
    },
    [state.answers, router]
  );

  const handleGoalNext = useCallback(
    (goal: GoalAnswer) => {
      if (goal === "soon") {
        routeToResults({ ...state.answers, goal }, router);
      } else {
        dispatch({ type: "NEXT" });
      }
    },
    [state.answers, router]
  );

  const handleFinalStep = useCallback(
    (riskOverride?: RiskAnswer) => {
      const answers = riskOverride
        ? { ...state.answers, risk: riskOverride }
        : state.answers;
      routeToResults(answers, router);
    },
    [state.answers, router]
  );

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <StepIncome
            value={state.answers.income}
            onChange={(v: IncomeAnswer) => setField("income", v)}
            onNext={handleIncomeNext}
          />
        );
      case 2:
        return (
          <StepEmergency
            value={state.answers.emergency}
            onChange={(v: EmergencyAnswer) => setField("emergency", v)}
            onNext={handleEmergencyNext}
          />
        );
      case 3:
        return (
          <StepDebt
            value={state.answers.debt}
            onChange={(v: DebtAnswer) => setField("debt", v)}
            onNext={handleDebtNext}
          />
        );
      case 4:
        return (
          <StepGoal
            value={state.answers.goal}
            onChange={(v: GoalAnswer) => setField("goal", v)}
            onNext={(v: GoalAnswer) => handleGoalNext(v)}
          />
        );
      case 5:
        return (
          <StepRisk
            value={state.answers.risk}
            onChange={(v: RiskAnswer) => setField("risk", v)}
            onNext={handleFinalStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Nav />
      <QuizShell currentStep={state.step}>
        {state.step > 1 && (
          <button
            type="button"
            onClick={() => dispatch({ type: "BACK" })}
            className="mb-4 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <AnimatePresence mode="wait" custom={state.direction}>
          <motion.div
            key={state.step}
            custom={state.direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </QuizShell>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <QuizContent />
    </Suspense>
  );
}
