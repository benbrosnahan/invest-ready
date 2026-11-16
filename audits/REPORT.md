# Invest Ready audit, 2026-11-15

Audited `main` at `30f5146`, live at https://invest-ready.vercel.app. Fixed on `audit-redesign`.

Invest Ready asks five questions and answers one: is investing this student's right next dollar? The order of the decisions is sound and the copy is calm. Lighthouse scored the live quiz 99 to 100 for performance, best practices and SEO, a full journey made no request to another site, and all 11 outbound links resolved.

The problems were in the money. Checked against primary sources as of 15 November 2026, there were **3 P0 and 9 P1 money and claims issues**, out of 31 findings in total.

- **A student could be told they are ready without ever being asked about debt (MONEY-01).** A double-click fired the step twice. Double-clicking the cushion answer skipped the debt question and still ended on "You're ready to start investing."
- **Students were sent to a Roth IRA they could not legally fund, or told they could put in more than they may (MONEY-02, MONEY-03).**
  - A "regular allowance" counted as income, then retirement led to a Roth IRA, which takes only pay from work (IRS Pub 590-A).
  - The limit was shown as a flat $7,500. The IRS caps it at what you earned from work if that is less. A student who earned $4,000 and puts in $7,500 owes 6% on the $3,500 extra every year until it is taken out.
- **Some answers routed money to the wrong place.**
  - Every student loan counted as under 8% (MONEY-04), though 2026-27 graduate loans charge 8.07% and PLUS loans 9.07%.
  - Money needed in 3 to 5 years could go 100% into stocks (MONEY-05). The SEC says avoid risky investments for goals five years or less away.
- **Figures were stale or overstated.**
  - Savings rates were from June, and SoFi's rate needs direct deposit; without it the rate is 0.80% (MONEY-06).
  - The growth table compounded to 7.23% a year and overstated 40 years at $200 a month by $30,654 (MONEY-07).
  - It called 7% the S&P 500's average, which is about 10% before inflation and 6.8% after (MONEY-08).
  - One month of savings was presented as enough (MONEY-09), and the employer match was never mentioned (MONEY-10).

## Scoreboard

Scans: live on 2026-11-15 (`results/2026-11-15-live`) and a local production build of `audit-redesign` (`results/2026-11-15-local`), one Lighthouse run per page.

| Page | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|
| Quiz, mobile, live / after | 99 / 100 | 93 / 100 | 100 / 100 | 100 / 100 | 1860 / 756 ms |
| Quiz, desktop, live / after | 100 / 100 | 93 / 100 | 100 / 100 | 100 / 100 | 436 / 214 ms |
| Result, mobile, live / after | 100 / 98 | 88 / 100 | 100 / 100 | 100 / 66* | 1827 / 2240 ms |
| Result, desktop, live / after | 100 / 100 | 88 / 100 | 100 / 100 | 100 / 66* | 489 / 507 ms |

\* /results is `noindex` on purpose: it is empty without a session.

Other measures, live then after:
- GEO 55 to 84
- Design 68 to 72, then 85 to 91
- Header check 40 to 80
- Flow INP 83/64 ms to 69/57 ms
- Sideways scrolling: 0 of 25 page and width pairs, both times
- axe: contrast and label failures, then 0
- Live security (71) needs a deploy to re-measure; local plain HTTP cannot score it

Tests: 77 Playwright tests, 2 of them known issues. 31 of the 32 money tests fail on the pre-audit site.

## Issues

Sources were read on 2026-11-15.

| ID | Sev | Finding | Status | Source |
|---|---|---|---|---|
| MONEY-01 | P0 | A double-click skips a question: the debt question can be skipped and the result is still "You're ready" (reproduced on live) | Fixed | Live reproduction |
| MONEY-02 | P0 | "Regular allowance" counts as income, then a Roth IRA is recommended (it needs pay from work) | Fixed: new answer "Only from family or aid" leads to a brokerage account | https://www.irs.gov/publications/p590a |
| MONEY-03 | P0 | Roth limit shown as a flat $7,500, without "or your pay from work, if less"; going over costs a 6% tax every year | Fixed | https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits, https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500 |
| MONEY-04 | P1 | Every "student loan" counted as under 8%; 2026-27 grad loans are 8.07%, PLUS 9.07%, private loans often higher | Fixed | https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-06-04/interest-rates-federal-direct-loans-first-disbursed-between-july-1-2026-and-june-30-2027 |
| MONEY-05 | P1 | Money needed in 3 to 5 years goes into stock funds; the SEC says avoid risk for goals 5 years or less away | Fixed: cutoff moved from 3 to 5 years; needs Ben's sign-off | https://www.investor.gov/sites/investorgov/files/2019-02/Saving-and-Investing.pdf |
| MONEY-06 | P1 | Savings rates from June; SoFi's 3.10% needs direct deposit (0.80% without). Now Wealthfront 3.55%, Marcus 3.50%, SoFi 3.30% or 0.80% | Fixed | https://www.wealthfront.com/cash, https://www.marcus.com/us/en/savings/high-yield-savings, https://www.sofi.com/banking/high-yield-savings-account/ (rate sheet effective 10/20/2026) |
| MONEY-07 | P1 | Growth table compounds 7%/12 a month (7.23% a year); overstates $200 a month over 40 years by $30,654 ($524,963 vs $494,308) | Fixed | Annuity formula |
| MONEY-08 | P1 | "7% (S&P 500 historical average)" is wrong: the average is about 10.0% before inflation and 6.8% after (1928-2025). The same 7% was applied to bond-heavy mixes | Fixed | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html, https://fred.stlouisfed.org/series/CPIAUCNS |
| MONEY-09 | P1 | One month of savings presented as enough; guidance is three to six months | Wording fixed; the gate threshold needs Ben | https://www.finra.org/investors/personal-finance/start-emergency-fund |
| MONEY-10 | P1 | Employer match never mentioned (the README orders it before investing) | Fixed: one line on yes results | SEC roadmap above |
| MONEY-11 | P1 | The earned-income rule was hidden in a collapsed panel | Fixed | IRS Pub 590-A |
| MONEY-12 | P1 | Brokerage "no penalties to withdraw" with no word on tax on gains or a falling value | Fixed | https://www.irs.gov/taxtopics/tc409 (cited, not re-read) |
| MONEY-13 | P2 | VT fee 0.07% should be 0.06%; VXUS 0.07% should be 0.05%; VTI renamed "Vanguard Morningstar Total Stock Market ETF" | Fixed | https://fund-docs.vanguard.com/F3141.pdf, F3369.pdf, F0970.pdf |
| MONEY-14 | P2 | BND called "more predictable"; its 5-year average to September 2026 is -0.64% a year | Fixed | https://fund-docs.vanguard.com/F0928.pdf |
| MONEY-15 | P2 | "Free with no minimums" for all four brokers; Vanguard charges $25 a year without e-delivery | Fixed: fee named; unverified minimum claims removed | https://investor.vanguard.com/client-benefits/account-fees |
| MONEY-16 | P2 | Savings account called "no risk"; the list called "Top" | Fixed | Wealthfront FDIC terms |
| MONEY-17 | P2 | A missing cushion ends the quiz before debt is asked, so card debt is never mentioned | Wording fixed; question order needs Ben | SEC roadmap |
| MONEY-18 | P2 | Card rates given as "20 to 30%" and "20 to 25%"; the Fed's figure is 22.36% | Fixed | https://www.federalreserve.gov/releases/g19/current/default.htm |
| MONEY-19 | P2 | Copy states advice as certain ("You're ready", "ideal", "the right fit") | Fixed | |
| MONEY-20 | P3 | VT owns stocks from "every country" (it is 47+); FSKAX "only at Fidelity" | Fixed | VT fact sheet |
| SCOPE-01 | P2 | The README promises results you can share by URL; a shared /results link opens the quiz | Known issue; README corrected; needs Ben | |
| SCOPE-02 | P3 | Students with no SSN or under 18 cannot open these accounts as described | Fixed: note in the account guide | |
| UX-01 | P1 | framer-motion fade-ins leave content at opacity 0, including in the quiz's server HTML | Fixed: CSS keyframes | |
| UX-02 to UX-05 | P2 | Emoji icons and off-palette colors; "$4K" for $3,600 and no input cap; metadata promised "how much to put in" and used an em dash; header said "No data stored" | Fixed | |
| A11Y-01, 02 | P1 | Contrast failures (3 to 9 per screen); growth input has no label (axe critical) | Fixed | |
| A11Y-03 to 08 | P2/P3 | No main or h1, text under 13px, link name mismatch, no radiogroup, no reduced-motion rule, every info button named "Learn more" | Fixed | |
| SEO-01, 02 | P2/P3 | No canonical, robots, sitemap, JSON-LD or og:image; /results could be indexed | Fixed | |
| SEC-01 | P2 | No CSP or security headers (headers scored 27 of 100) | Fixed; the live score needs a deploy | |
| SEC-02 | P2 | Next 14.2.35 advisories are fixed only in Next 16; exposure is low (static pages, no server actions or next/image) | Known issue; needs Ben | |
| PERF-01, DX-01, DX-02 | P2/P3 | Unused framer-motion; no tests; savings list written twice; dead components | Fixed | |

## Money details

**Inventory: every figure and claim, and what it was checked against.**

| Claim | Source | Verdict |
|---|---|---|
| Income counts if from a job, stipend, scholarship or allowance | IRS Pub 590-A: compensation only; scholarships only if in W-2 box 1; certain non-tuition fellowship and stipend payments count | Wrong for the Roth path |
| One month of savings is enough to invest | FINRA, SEC: three to six months | Misleading |
| Cards charge 20 to 30% | Fed G.19, Q3 2026: 22.36% on accounts assessed interest | Roughly right, made consistent |
| Student loans are under 8% | FSA 2026-27: undergraduate 6.52%, graduate 8.07%, PLUS 9.07% (2025-26: 6.39%, 7.94%, 8.94%) | Wrong for graduate and PLUS |
| 1 to 3 years goes to savings; up to 10 years goes to stocks | SEC roadmap: five years or less, avoid risk | Misroutes 3 to 5 year money |
| 2026 IRA limit $7,500 | IRS IR-2025-111, Notice 2025-67 (Notice 2026-66 keeps $7,500 for 2027) | Right, but the earned-income cap was missing |
| Fund fees: VTI 0.03, VT 0.07, VXUS 0.07, BND 0.03, FSKAX 0.015 | Vanguard fact sheets at 30 Sep 2026: 0.03 / 0.06 / 0.05 / 0.03; Fidelity: 0.015, $0 minimum | Two stale |
| BND has "more predictable returns" | 5-year NAV return -0.64% a year | Overconfident |
| 7% is the S&P 500 historical average | Damodaran: 10.02% a year 1928-2025; CPI-U 17.3 to 324.054 is 3.04% a year; so 6.78% after inflation | Mislabeled |
| Savings rates: Wealthfront 3.30, Marcus 3.40, SoFi 3.10 | 3.55% base (11/13/2026), 3.50% (11/15/2026), 3.30% only with direct deposit or $5,000 every 31 days, else 0.80% | Stale; SoFi's condition hidden |
| "No risk" | Wealthfront is not a bank; FDIC cover comes through partner banks | Overconfident |
| "Free with no minimums" | Vanguard charges $25 a year without e-delivery | Missing a fee |

**Profiles, worked by hand.**
- **Maya** (campus job, 6.52% federal loan, retirement, moderate). The Roth IRA is right, but her cap is the lesser of $7,500 and her pay from work. At 7% a year, $200 a month is worth $34,210 / $101,507 / $233,891 / $494,308 after 10, 20, 30 and 40 years (monthly rate 1.07^(1/12) - 1). The app showed $34,617 / $104,185 / $243,994 / $524,963.
- **Sam** (allowance only, retirement). The app said Roth IRA. Expected: no compensation means any contribution is an excess taxed 6% a year, so a brokerage account fits.
- **Priya** (11.5% private loan). Picked "low interest" because the option listed "Student loans", and was told she was ready. Expected: not yet, by the app's own 8% line.
- **Jordan** (car in 4 years). Was shown a stock portfolio. Expected: savings, per the SEC.
- **Alex** ($1,500 card balance at 22%, no savings). Was told to build a cushion; the debt was never mentioned.

**MONEY-01 mechanism.** Each answer called `onNext` 180 ms after a click, and the reducer's `NEXT` advanced from whatever step was current. The fix:
- `NEXT` carries the step it came from and is ignored once the quiz has moved on.
- Rapid clicks are debounced, so the last click wins.
- `getResult` returns null if any answer on the way to a result is missing.

## Design

Direction: Loan Desk's calm cream and green, built around one element, with Loan Desk's tokens and fonts. The signature element is the readiness ladder: the five steps in the order money should go (money coming in, a cushion, no debt above 8%, time to grow, a mix you can hold), lit one by one down to the step where the student's answer stopped. The same five steps are the quiz's progress bar. Before and after screenshots are kept on disk in `screenshots/` (not in git).

## Not verified

- Broker minimums for Fidelity, Schwab and Robinhood: their pages blocked automated reads, so those claims were removed rather than stated.
- The FINRA, investor.gov, studentaid.gov and Vanguard fee pages were checked from official text in search results, not loaded directly. IRS Topic 409 is cited but was not re-read.
- The live security score, until a deploy. Screen readers and real devices were not tested by hand.
- Rates drift: each one carries its date in `src/lib/data.ts`.

## Method

- **Money.** Every figure and claim in `src/` was checked against the sources above. `tests/support/money-oracle.mjs` is written from the annuity formula, the IRS rule and the SEC guidance, never from the app's code.
- **Scans.** The Loan Desk kit with its fixtures rewritten for the quiz. The audited states are the first question, the debt question, a not-yet result, a Roth plan and a savings result. The user flow answers all five questions, types a monthly amount and opens the account guide. The INP probe drives Loan Desk's tabs and is not run.
- **Accessibility.** axe-core (WCAG 2.2 A/AA plus best practices) on 7 screens at 375x812 and 1440x900, plus checks for the 13px type floor, the 40px tap targets, reduced motion and keyboard focus.

## Follow-ups, 2026-11-15 (deployed the same day)

| ID | Was | Now |
|---|---|---|
| MONEY-05 | Cutoff moved from 3 to 5 years; needed Ben's sign-off | Signed off: 5 years stays |
| MONEY-09 | The gate threshold needed Ben | Decided: the gate stays at one month, and the copy keeps three to six months as the aim |
| MONEY-17 | Question order needed Ben | Fixed: income, debt, cushion, goal, risk |
| SCOPE-01 | Known issue | Fixed: every result has its own link |
| SEC-02 | Known issue | Fixed: Next 16.4.6 and React 19.3.1 |

**MONEY-17, the new order.** The SEC roadmap (https://www.investor.gov/sites/investorgov/files/2019-02/Saving-and-Investing.pdf) lists "Pay off any high interest debts" before saving and investing, and puts an emergency fund "After paying off credit cards or other high interest debt". A student with card debt and no savings now gets "Pay off the costly debt first", plus one line from FINRA's Financial Foundations page (https://www.finra.org/investors/investing/investing-basics/financial-foundations): set a little aside while paying the debt down, then build a cushion of at least a month before investing. The only verdict that changed: debt above 8% with no cushion was "build a cushion" and is now "pay off the debt". Both are "not yet". All 76 distinct answer paths are checked against the oracle. The double-click guard holds on questions 1 to 3.

**SEC-02.** Next 16.4.6 (Turbopack), React 19.3.1, ESLint 9 flat config; `npm run lint` runs `eslint .`; /results uses useSyncExternalStore; every route still prerendered static; headers unchanged. `npm audit --omit=dev`: 0 vulnerabilities.

**SCOPE-01, shareable results.** The answers live after the # (`/results#income=consistent&debt=none&emergency=funded&goal=retirement&risk=moderate`), which browsers never send to a server, so nothing is stored, logged or sent in a Referer header. The verdict is worked out again in the viewer's browser. A link is accepted only if the quiz could have produced it (`src/lib/share.ts`); anything partial, edited, oversized or malformed shows "This link does not hold a full answer" and never a verdict. A "Share this answer" card has Copy link (and Share on touch screens), with a copy-by-hand fallback. A viewer sees "Someone shared this answer with you" and "Take the quiz yourself"; opening a link writes nothing to their storage. /results stays noindex with a canonical to /, and its HTML is identical for every result, so link previews never show a verdict. Tests: `share.spec.mjs` (15 cases).

Playwright: 95 pass locally and on the production build.

Not verified: Share on a real phone, and link previews in iMessage, Slack or LinkedIn (tags checked in the built HTML only).
