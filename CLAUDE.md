# Invest Ready, project notes

Five-step quiz answering one question: is investing this person's right next dollar?

**Live:** https://invest-ready.vercel.app

## Product rules that are not negotiable

1. **The tool must be willing to answer no.** The quiz stops at the first step that is not in place: money coming
   in, no debt above 8%, a cushion of at least one month, and a goal at least five years away (debt before the
   cushion, as the SEC's roadmap orders them). If an earlier step is unmet the answer is "not yet", with the reason. A recommender that always recommends the thing it is named
   after is marketing.
2. **Never leave a yes at a blank page.** If the answer is yes, `AccountOpenGuide` walks the account opening.
   Stopping at "you're ready" is where people drop off.
3. **No accounts, no backend, nothing sent.** Client-side only. Answers stay in the tab's sessionStorage; the CSP in
   `next.config.mjs` blocks requests to other sites.
4. **A Roth IRA only with pay from work.** IRA contributions need taxable compensation, capped at the lesser of the
   year's limit and what was earned. Money from family or aid goes to a brokerage account.

## Layout

- `src/lib/logic.ts`: the readiness rules. The product lives here.
- `src/lib/data.ts`: every outside figure (rates, fees, limits) with its source and the date it was checked.
- `src/lib/questions.ts`: the five questions and how each answer reads on the result's ladder.
- `src/lib/compound.ts`: growth projections at 7% a year, compounded monthly at (1.07)^(1/12) - 1.
- `src/components/quiz/`: `QuestionStep` and `ProgressLadder`.
- `src/components/results/Ladder.tsx`: the signature element, the five steps lit up to where the answer stopped.
- `src/components/results/AccountOpenGuide.tsx`: the yes path.
- `audits/`: the audit kit, the Playwright suite (`knownIssue()` marks open items) and the money oracle.

## Design

The Cense system shared with Loan Desk and Decode: cream #FFFCEC, green #275B2D, orange #A8531F for text and
#C1652E for marks, Bricolage Grotesque for headlines, Instrument Sans for reading, 13px floor, 48px primary buttons,
pill buttons, 24px card radius. Entrances are CSS keyframes, never framer-motion.

## Open decisions (see audits/REPORT.md)

- Whether one month is the right cushion floor (guidance is three to six).
- Whether results should be shareable by URL (hash, so answers never reach a server log).
- When to move from Next 14 to 16.

## History

Scaffolded from the Loan Lab folder, which is why an earlier version of this file was a verbatim copy of Loan Lab's
spec describing the wrong product. Replaced 2026-08-26. Audited and rebuilt on the Cense design system 2026-11-15.
Loan Lab is a separate product at https://loan-lab.vercel.app.

Stack: Next.js App Router, TypeScript, Tailwind.
