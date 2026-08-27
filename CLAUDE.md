# Invest Ready — project notes

Five-step quiz answering one question: is investing this person's right next dollar?

**Live:** https://invest-ready.vercel.app

## Product rules that are not negotiable

1. **The tool must be willing to answer no.** Order of operations is high-interest
   debt, then emergency fund, then employer match, then invest. If an earlier step
   is unmet the answer is no, with the reason. A recommender that always recommends
   the thing it is named after is marketing.
2. **Never leave a yes at a blank page.** If the answer is yes, `AccountOpenGuide`
   walks the account opening. Stopping at "you're ready" is where people drop off.
3. **No accounts, no backend, nothing stored.** Client-side only, shareable by URL.
   Financial inputs never leave the browser.

## Layout

- `src/lib/logic.ts` — the readiness decision rules. The product lives here.
- `src/lib/compound.ts` — growth projections.
- `src/components/quiz/` — `StepDebt`, `StepEmergency`, `StepIncome`, `StepRisk`,
  `StepGoal`, wrapped by `QuizShell`.
- `src/components/results/AccountOpenGuide.tsx` — the yes path.

## History

Scaffolded from the Loan Lab folder, which is why an earlier version of this file
was a verbatim copy of Loan Lab's spec describing the wrong product. Replaced
2026-08-26. Loan Lab is a separate product at https://loan-lab.vercel.app.

Stack: Next.js App Router, TypeScript, Tailwind, Framer Motion.
