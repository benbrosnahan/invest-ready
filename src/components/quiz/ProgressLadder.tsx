import { QUESTIONS } from "@/lib/questions";
import { cn } from "@/lib/utils";

/**
 * The quiz's progress, drawn as the same five rungs the result shows: the question you are on, the ones behind
 * you, and the ones still ahead. The order is the point, so each rung is named.
 */
export default function ProgressLadder({ step }: { step: number }) {
  return (
    <nav aria-label="Questions">
      <p className="text-sm font-semibold text-slate-600">
        Question {step} of {QUESTIONS.length}
      </p>
      <ol className="mt-2 grid grid-cols-5 gap-1.5">
        {QUESTIONS.map((q, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li key={q.id} aria-current={current ? "step" : undefined}>
              <span
                aria-hidden
                className={cn(
                  "block h-1.5 rounded-full transition-colors duration-300",
                  done || current ? "bg-navy" : "bg-slate-200"
                )}
              />
              <span
                className={cn(
                  "mt-1.5 block truncate text-xs",
                  current ? "font-bold text-slate-900" : done ? "text-slate-700" : "text-slate-600"
                )}
              >
                {q.short}
                <span className="sr-only">{done ? ", answered" : current ? ", current" : ", not yet"}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
