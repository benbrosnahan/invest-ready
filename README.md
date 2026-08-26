# Invest Ready

**Live: [invest-ready.vercel.app](https://invest-ready.vercel.app)**

Five questions, under three minutes, one answer: are you actually ready to start investing,
and if not, what has to happen first.

## Why it works this way

"Should I invest?" is almost never the real question for someone in their twenties. The real
question is whether investing is the right next dollar, and usually it is not. High interest
debt beats market returns. An emergency fund beats both. An employer match beats everything.

So the tool is built to tell a meaningful share of users **no**, and to explain the order
of operations instead. A recommendation engine that always recommends the thing it is named
after is marketing, not advice.

The last screen is the part most tools skip: if the answer is yes, it walks through actually
opening the account. Telling someone they are ready and leaving them at a blank page is where
the drop-off happens.

## How it is built

- Next.js App Router, TypeScript, Tailwind, Framer Motion
- `src/lib/logic.ts` holds the decision rules, `src/lib/compound.ts` the growth math
- Entirely client side. No login, no backend, nothing stored, shareable by URL

## Run it

```bash
npm install
npm run dev
```

Built with Claude Code. Part of [Cense](https://cense.beehiiv.com).
