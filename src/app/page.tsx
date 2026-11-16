"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import ProgressLadder from "@/components/quiz/ProgressLadder";
import QuestionStep from "@/components/quiz/QuestionStep";
import { QUESTIONS } from "@/lib/questions";
import { endsQuiz } from "@/lib/logic";
import { encodeAnswers } from "@/lib/share";
import { ANSWERS_KEY, storage } from "@/lib/utils";
import { TOTAL_STEPS, type Answers, type Question, type QuizAnswers } from "@/types";

interface State {
  step: number;
  answers: Answers;
}

type Action =
  | { type: "ANSWER"; question: Question; value: string }
  // `from` is the step the move was made on. A move from a step the quiz has already left is ignored, so a
  // double-click, or a click during the transition, can never skip a question (audits/REPORT.md, MONEY-01).
  | { type: "NEXT"; from: number }
  | { type: "BACK" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ANSWER":
      return { ...state, answers: { ...state.answers, [action.question]: action.value } };
    case "NEXT":
      if (action.from !== state.step) return state;
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS) };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 1) };
  }
}

// Long enough to see the choice land, short enough not to feel slow.
const ADVANCE_MS = 200;

export default function QuizPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, { step: 1, answers: {} });
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishing = useRef(false);
  const firstRender = useRef(true);

  const question = QUESTIONS[state.step - 1];

  const answer = useCallback(
    (value: string) => {
      if (finishing.current) return;
      const q = question.id;
      const step = state.step;
      const answers = { ...state.answers, [q]: value } as Answers;
      dispatch({ type: "ANSWER", question: q, value });
      // The last click wins: a second click before the move replaces the first.
      if (pending.current) clearTimeout(pending.current);
      pending.current = setTimeout(() => {
        pending.current = null;
        if (endsQuiz(q, value as QuizAnswers[typeof q], answers)) {
          finishing.current = true;
          // Only the answers on the way to this result are kept, so an earlier run's later answers never leak in.
          const order = QUESTIONS.map((x) => x.id);
          const kept = Object.fromEntries(order.slice(0, step).map((k) => [k, answers[k]]));
          storage.set(ANSWERS_KEY, JSON.stringify(kept));
          // The answers ride in the fragment, so the result's address is also its share link (SCOPE-01).
          router.push(`/results#${encodeAnswers(kept as Answers)}`);
        } else {
          dispatch({ type: "NEXT", from: step });
        }
      }, ADVANCE_MS);
    },
    [question.id, state.step, state.answers, router]
  );

  const back = () => {
    if (pending.current) clearTimeout(pending.current);
    pending.current = null;
    dispatch({ type: "BACK" });
  };

  useEffect(() => () => {
    if (pending.current) clearTimeout(pending.current);
  }, []);

  // After a move, put focus on the new question so keyboard and screen reader users start there.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById(`q-${QUESTIONS[state.step - 1].id}`)?.focus();
  }, [state.step]);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <h1 className="font-display text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
          Are you ready to start investing?
        </h1>
        {state.step === 1 && (
          <p className="mt-1.5 max-w-prose text-base leading-relaxed text-slate-700">
            Five questions. You get a yes or a not yet, and one next step.
          </p>
        )}

        <div className="mt-6">
          <ProgressLadder step={state.step} />
        </div>

        <div className="mt-8">
          <QuestionStep
            key={question.id}
            question={question}
            value={state.answers[question.id]}
            onAnswer={answer}
          />
        </div>

        {state.step > 1 && (
          <button type="button" onClick={back} className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2 -ml-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
            <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
      </main>
      <Footer />
    </>
  );
}
