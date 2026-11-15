# Invest Ready

**Live: [invest-ready.vercel.app](https://invest-ready.vercel.app)**

Five questions, about two minutes, one answer: are you ready to start investing, and if not, what has to happen
first.

## Why it works this way

"Should I invest?" is almost never the real question for someone in their twenties. The real question is whether
investing is the right next dollar, and often it is not. Money coming in comes first, then paying off anything above
8% interest, then a cushion of at least a month (three to six is the aim). Money needed within five years stays in savings. An employer match, when there is
one, comes before everything else.

So the tool is built to tell a meaningful share of people **not yet**, and to show where they stopped: the result
draws the five steps as a ladder, lit up to the rung their answer reached. A recommender that always recommends the
thing it is named after is marketing, not advice.

If the answer is yes, it names one account (a Roth IRA only when there is pay from work to put in), a few low-cost
index funds, and walks through opening the account. Telling someone they are ready and leaving them at a blank page
is where the drop-off happens.

## How it is built

- Next.js App Router, TypeScript, Tailwind, on the shared Cense design system (Loan Desk and Decode use the same
  tokens and fonts)
- `src/lib/logic.ts` holds the decision rules, `src/lib/data.ts` every outside figure with its source and the date it
  was checked, `src/lib/compound.ts` the growth math
- Entirely client side. No login, no backend, nothing sent anywhere: the answers stay in the browser tab
  (sessionStorage) and a Content Security Policy keeps the page from talking to any other site

## Run it

```bash
npm install
npm run dev
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`, and the Playwright suite in `audits/`
(`cd audits && npm ci && npm run setup && npm test`).

## Keeping the figures true

Savings rates, fund fees, the IRA limit and loan rates change. Each lives once in `src/lib/data.ts` with its source
and the date it was read, and the page shows that date. The money tests in `audits/tests/` check the figures and the
growth math against an independent oracle.

Part of [Cense](https://cense.beehiiv.com).
