import { answeredPath } from "@/lib/logic";
import { ANSWER_SUMMARY, QUESTIONS } from "@/lib/questions";
import { cn } from "@/lib/utils";
import type { Answers, QuizResult } from "@/types";

/**
 * The signature element: the five steps in the order money should go, lit up to the rung where this student's
 * answer stopped. A yes clears all five. A not yet shows exactly which rung is missing and what is still ahead,
 * so "not yet" reads as a place on a path rather than a verdict.
 */
export default function Ladder({ answers, result }: { answers: Answers; result: QuizResult }) {
  const path = answeredPath(answers);
  const stoppedAt = result.type === "gate" || (result.type === "plan" && result.accountType === "hysa") ? path[path.length - 1] : null;

  return (
    <ol className="relative" aria-label="Your steps, in order">
      {QUESTIONS.map((q, i) => {
        const value = answers[q.id];
        const reached = path.includes(q.id);
        const stop = q.id === stoppedAt;
        const clear = reached && !stop;
        const last = i === QUESTIONS.length - 1;
        const status = stop ? "stopped here" : "in place";
        return (
          <li key={q.id} className="relative flex gap-4 pb-5 last:pb-0">
            {!last && (
              <span aria-hidden className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-slate-200">
                {clear && <span className="rail-fill block h-full w-full bg-navy" />}
              </span>
            )}
            <span
              aria-hidden
              style={{ ["--i" as string]: i }}
              className={cn(
                "rung-mark relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                clear && "border-navy bg-navy text-white",
                stop && "border-accent bg-accent-light text-accent-hover",
                !reached && "border-slate-300 bg-white text-slate-600"
              )}
            >
              {clear ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : stop ? (
                "!"
              ) : (
                i + 1
              )}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className={cn("text-base font-semibold leading-snug", reached ? "text-slate-900" : "text-slate-600")}>
                {q.rung}
                {reached && <span className="sr-only">: {status}.</span>}
              </p>
              <p className={cn("mt-0.5 text-sm leading-snug", stop ? "font-semibold text-accent-hover" : "text-slate-700")}>
                {reached && value !== undefined
                  ? (ANSWER_SUMMARY[q.id] as Record<string, string>)[value]
                  : "Not asked yet"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
