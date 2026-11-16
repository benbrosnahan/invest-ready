// Shareable results (audits/REPORT.md, SCOPE-01). A result's link carries the answers in the URL fragment, the part
// after #, which browsers never send to a server, so the answers stay out of request logs and Referer headers. The
// link holds only the coarse choices the quiz offers, readable as written: "#income=consistent&debt=none&...".
// Nothing is stored anywhere; the result is worked out again from the answers by whoever opens the link.

import { answeredPath, cleanAnswers, getResult } from "@/lib/logic";
import { QUESTION_ORDER, type Answers, type Question, type QuizResult } from "@/types";

/** Longer than any real answer set, so a pasted wall of text is refused before it is parsed. */
const MAX_LENGTH = 160;

/** The fragment for a set of answers: only the questions on the way to the result, in the quiz's order. */
export function encodeAnswers(answers: Answers): string {
  const params = new URLSearchParams();
  for (const q of answeredPath(answers)) params.set(q, String(answers[q]));
  return params.toString();
}

export type Decoded =
  | { status: "empty" }
  | { status: "invalid" }
  | { status: "ok"; answers: Answers; result: QuizResult };

/**
 * Reads a fragment back. It is accepted only when it is exactly a set of answers the quiz could have produced: every
 * key a question, every value one of that question's choices, no repeats, nothing past where the quiz stops, and
 * nothing missing on the way to a result. Anything else is a tampered or partial link and gets no verdict.
 */
export function decodeHash(hash: string): Decoded {
  const raw = hash.replace(/^#/, "");
  if (raw === "") return { status: "empty" };
  if (raw.length > MAX_LENGTH) return { status: "invalid" };

  const seen: Record<string, string> = {};
  for (const part of raw.split("&")) {
    const eq = part.indexOf("=");
    if (eq < 1) return { status: "invalid" };
    let key: string;
    let value: string;
    try {
      key = decodeURIComponent(part.slice(0, eq));
      value = decodeURIComponent(part.slice(eq + 1));
    } catch {
      return { status: "invalid" };
    }
    if (!(QUESTION_ORDER as string[]).includes(key) || key in seen) return { status: "invalid" };
    seen[key] = value;
  }

  const answers = cleanAnswers(seen);
  // cleanAnswers drops unknown values; a dropped value means the link was changed.
  if (Object.keys(answers).length !== Object.keys(seen).length) return { status: "invalid" };
  const path = answeredPath(answers);
  if (path.length !== Object.keys(answers).length) return { status: "invalid" };
  const result = getResult(answers);
  if (!result) return { status: "invalid" };
  return { status: "ok", answers, result };
}

/** True when two answer sets are the same answers, whatever order their keys came in. */
export function sameAnswers(a: Answers, b: Answers): boolean {
  return QUESTION_ORDER.every((q: Question) => a[q] === b[q]);
}
