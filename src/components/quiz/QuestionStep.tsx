"use client";

import type { QuestionConfig } from "@/lib/questions";
import { cn } from "@/lib/utils";

interface Props {
  question: QuestionConfig;
  value: string | undefined;
  onAnswer: (value: string) => void;
}

/**
 * One question. Each answer is a button that records it and moves on, so the chosen one is marked with
 * aria-pressed when you come back to it. The page debounces the move, so a double-click answers once.
 */
export default function QuestionStep({ question, value, onAnswer }: Props) {
  const titleId = `q-${question.id}`;
  const hintId = `q-${question.id}-hint`;
  return (
    <div className="rise">
      <h2 id={titleId} tabIndex={-1} className="text-balance focus:outline-none font-display text-[1.75rem] font-bold leading-[1.15] tracking-[-0.01em] text-slate-900 sm:text-[2rem]">
        {question.title}
      </h2>
      <p id={hintId} className="mt-2 text-base leading-relaxed text-slate-700">
        {question.hint}
      </p>
      <div role="group" aria-labelledby={titleId} aria-describedby={hintId} className="mt-6 flex flex-col gap-3">
        {question.options.map((opt) => {
          const chosen = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={chosen}
              onClick={() => onAnswer(opt.value)}
              className={cn(
                "group flex min-h-[64px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-[border-color,background-color,transform] duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:scale-[0.99]",
                chosen ? "border-navy bg-selected" : "border-line bg-white hover:border-slate-400"
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold leading-snug text-slate-900">{opt.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-slate-700">{opt.description}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  chosen ? "border-navy bg-navy text-white" : "border-slate-300 text-transparent group-hover:border-slate-500"
                )}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
