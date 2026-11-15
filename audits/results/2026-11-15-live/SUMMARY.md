# Audit summary

- Target: https://invest-ready.vercel.app/ (given with --url)
- Started: 2026-11-15T17:57:08.605Z
- Command: `node run.mjs --url https://invest-ready.vercel.app/ --runs 1`
- Budgets: FAIL: 24 passed, 4 failed, 1 not measured

| Step | Result | Time |
|---|---|---|
| lighthouse | ok | 28.7 s |
| flow | ok | 101.5 s |
| security | ok | 0.3 s |
| geo | ok | 11.3 s |
| design | ok | 103.2 s |
| ux | ok | under 0.1 s |
| tools | ok | 1.6 s |
| responsive | ok | 112.8 s |
| readable | failed: first run1: not readable within 30 s of the load event; returning run1: not readable within 30 s of the load event | 68.7 s |

## Scoreboard

| Page | Perf | A11y | BP | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|---|
| Quiz, mobile | 99 | 93 | 100 | 100 | 1860 ms | 1110 ms | 0 |
| Quiz, desktop | 100 | 93 | 100 | 100 | 436 ms | 241 ms | 0 |
| Result, mobile | 100 | 88 | 100 | 100 | 1827 ms | 778 ms | 0 |
| Result, desktop | 100 | 88 | 100 | 100 | 489 ms | 283 ms | 0 |

Median of 1 Lighthouse run per page, chosen by performance score. Quiz is a first visit to /; result is /results with a Roth IRA plan's answers in sessionStorage before load. TBT: quiz, mobile 26 ms, quiz, desktop 0 ms, result, mobile 0 ms, result, desktop 0 ms.

## Budgets

| Budget | Measured | Limit | Result |
|---|---|---|---|
| Performance, quiz, mobile | 99 | ≥ 90 | pass |
| Accessibility, quiz, mobile | 93 | ≥ 100 | **FAIL** |
| Best practices, quiz, mobile | 100 | ≥ 95 | pass |
| SEO, quiz, mobile | 100 | ≥ 100 | pass |
| LCP, quiz, mobile | 1860 ms | ≤ 2500 ms | pass |
| FCP, quiz, mobile | 1110 ms | ≤ 1800 ms | pass |
| CLS, quiz, mobile | 0 | ≤ 0.1 | pass |
| TBT, quiz, mobile | 26 ms | ≤ 200 ms | pass |
| Performance, quiz, desktop | 100 | ≥ 90 | pass |
| Accessibility, quiz, desktop | 93 | ≥ 100 | **FAIL** |
| Best practices, quiz, desktop | 100 | ≥ 95 | pass |
| SEO, quiz, desktop | 100 | ≥ 100 | pass |
| Performance, result, mobile | 100 | ≥ 90 | pass |
| Accessibility, result, mobile | 88 | ≥ 100 | **FAIL** |
| Best practices, result, mobile | 100 | ≥ 95 | pass |
| SEO, result, mobile | 100 | ≥ 100 | pass |
| LCP, result, mobile | 1827 ms | ≤ 2500 ms | pass |
| FCP, result, mobile | 778 ms | ≤ 1800 ms | pass |
| CLS, result, mobile | 0 | ≤ 0.1 | pass |
| TBT, result, mobile | 0 ms | ≤ 200 ms | pass |
| Performance, result, desktop | 100 | ≥ 90 | pass |
| Accessibility, result, desktop | 88 | ≥ 100 | **FAIL** |
| Best practices, result, desktop | 100 | ≥ 95 | pass |
| SEO, result, desktop | 100 | ≥ 100 | pass |
| Flow INP (worst timespan), mobile | 83 ms (Answer the five questions) | ≤ 200 ms | pass |
| Flow INP (worst timespan), desktop | 64 ms (Answer the five questions) | ≤ 200 ms | pass |
| Security score, live (floor) | 71 | ≥ 71 | pass |
| GEO score (floor) | 55 | ≥ 44 | pass |
| Readable, first visit (floor) | – (every load failed) | ≤ 3500 ms | not measured |

First-load JS is read from the local build, so it is checked only when the target is served from this machine.
Floors are not goals: they are the scores measured on 2026-11-02, so falling below one means something regressed.
The readable floor is a time, so going over it fails. It sits well above the times measured on 2026-11-02, because throttled loads on a shared machine are noisy: a regression guard, not a goal.

Targets, which never fail a run:

| Measure | Now | Target | Status |
|---|---|---|---|
| Security score, live | 71 | 90 | 19 to go |
| GEO score | 55 | 80 | 25 to go |

## User flow

Lighthouse user flow: first load, the five questions answered to a Roth IRA plan, a monthly amount typed into the growth table, and the account guide opened. Timespans measure INP, CLS and TBT; snapshots audit the state for accessibility, best practices and SEO.

### Mobile

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (quiz) | navigation | 100 | 93 | 100 | 100 | – | 0 | 2 ms |
| Answer the five questions | timespan | 100 | – | 100 | – | 83 ms | 0 | 3 ms |
| Result (Roth IRA plan) | snapshot | – | 88 | 100 | 100 | – | – | – |
| Type a monthly amount | timespan | 100 | – | 100 | – | 79 ms | 0 | 25 ms |
| Open the account guide | timespan | 100 | – | 100 | – | 37 ms | 0 | 0 ms |
| Account guide open | snapshot | – | 89 | 100 | 100 | – | – | – |

Failing audits: Background and foreground colors do not have a sufficient contrast ratio. (First load (quiz)); Elements with visible text labels do not have matching accessible names. (First load (quiz)); Document does not have a main landmark. (First load (quiz)); Reduce unused JavaScript (First load (quiz)); Network dependency tree (First load (quiz)); Background and foreground colors do not have a sufficient contrast ratio. (Result (Roth IRA plan)); Elements with visible text labels do not have matching accessible names. (Result (Roth IRA plan)); Form elements do not have associated labels (Result (Roth IRA plan)); 5 more.

### Desktop

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (quiz) | navigation | 100 | 93 | 100 | 100 | – | 0 | 0 ms |
| Answer the five questions | timespan | 100 | – | 100 | – | 64 ms | 0 | 0 ms |
| Result (Roth IRA plan) | snapshot | – | 88 | 100 | 100 | – | – | – |
| Type a monthly amount | timespan | 100 | – | 100 | – | 22 ms | 0 | 0 ms |
| Open the account guide | timespan | 100 | – | 100 | – | 24 ms | 0 | 0 ms |
| Account guide open | snapshot | – | 89 | 100 | 100 | – | – | – |

Failing audits: Background and foreground colors do not have a sufficient contrast ratio. (First load (quiz)); Elements with visible text labels do not have matching accessible names. (First load (quiz)); Document does not have a main landmark. (First load (quiz)); Reduce unused JavaScript (First load (quiz)); Legacy JavaScript (First load (quiz)); Network dependency tree (First load (quiz)); Background and foreground colors do not have a sufficient contrast ratio. (Result (Roth IRA plan)); Elements with visible text labels do not have matching accessible names. (Result (Roth IRA plan)); 6 more.


## Security

**71** of 100. HTTPS 100, headers 27, cookies 100, content 80, dependencies not measured.

Lighthouse-based checks: included, from the median mobile Lighthouse run of the quiz page.

- critical: Missing Content-Security-Policy (0/10 points)
- warning: Missing X-Content-Type-Options (0/4 points)
- warning: Missing X-Frame-Options (0/4 points)
- warning: CORS allows all origins

## GEO

**55** of 100: crawl access 20/20, server content 23/30, structured data 0/20, social and meta 7/15, LLM discovery 0/10, indexability 5/5.

Words in the raw HTML: 47. Words once rendered: 47. Content parity 100%.

- fail: H1 Tag in SSR (0/5)
- warn: Heading Hierarchy (1/3)
- fail: JSON-LD in SSR (0/12)
- fail: Rich Schema Types (0/8)
- warn: Open Graph Tags (3/7)
- warn: Canonical URL (0/4)

High-priority recommendations: Add JSON-LD structured data.

## Design

| State | Desktop | Mobile | Score | Grade | Accessibility | Consistency | Motion | Performance |
|---|---|---|---|---|---|---|---|---|
| quiz | 68.1 D | 68.1 D | 68 | D | 30 | 88 | 66 | 100 |
| quiz-debt | 68.1 D | 68.1 D | 68 | D | 30 | 88 | 66 | 100 |
| result-gate | 71.7 C | 71.7 C | 72 | C | 42 | 88 | 66 | 100 |
| result-plan | 71.7 C | 71.7 C | 72 | C | 42 | 88 | 66 | 100 |
| result-savings | 71.7 C | 71.7 C | 72 | C | 42 | 88 | 66 | 100 |

Design engine 1.3.0. Score is the mean of the rounded desktop (1440x900) and mobile (375x812) scores; buckets are 0 to 100. The engine scores against Material 3 conventions and this app does not use Material, so a radius or target-size rule is advisory unless it is also a WCAG failure.

## UX deterministic

| Screen | Rule findings | P1 | P2 | P3 | Probe findings | Design |
|---|---|---|---|---|---|---|
| quiz-desktop | 6 | 2 | 4 | 0 | 1 | 68.1 |
| quiz-mobile | 6 | 2 | 4 | 0 | 0 | 68.1 |
| quiz-debt-desktop | 6 | 2 | 4 | 0 | 1 | 68.1 |
| quiz-debt-mobile | 6 | 2 | 4 | 0 | 0 | 68.1 |
| result-gate-desktop | 5 | 2 | 3 | 0 | 0 | 71.7 |
| result-gate-mobile | 5 | 2 | 3 | 0 | 0 | 71.7 |
| result-plan-desktop | 5 | 2 | 3 | 0 | 1 | 71.7 |
| result-plan-mobile | 5 | 2 | 3 | 0 | 0 | 71.7 |
| result-savings-desktop | 5 | 2 | 3 | 0 | 0 | 71.7 |
| result-savings-mobile | 5 | 2 | 3 | 0 | 0 | 71.7 |

Distinct findings, with how many screens show each:

- P1 No @media (prefers-reduced-motion: reduce) rule found (10 screens)
- P1 4 to 11 text node(s) below WCAG contrast (4.5:1 normal / 3:1 large). (10 screens)
- P2 Missing landmark(s): main, nav, contentinfo. (10 screens)
- P2 No <h1> found (4 screens)
- P2 1 to 6 pointer target(s) smaller than M3's comfortable 48×48px at 1440px wide (5 screens)
- P2 3 to 18 reading-copy text node(s) below 16px (or any text below 11px). (10 screens)
- P2 1 to 6 tap target(s) smaller than M3's comfortable 48×48px at 375px wide (5 screens)
- P3 Primary controls show no hover feedback (3 screens)

These are rule findings only. UX scores come from the AI review, which reads ux/<screen>.jpg and ux/<screen>.dom.json and writes ux/ai/<screen>.json; then `node lib/merge-ux.mjs <results>/ux` scores and merges them.

## Responsive overflow

| State | 320 | 375 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| quiz | ok, 641 px | ok, 813 px | ok, 1025 px | ok, 769 px | ok, 901 px |
| quiz-debt | ok, 650 px | ok, 813 px | ok, 1025 px | ok, 769 px | ok, 901 px |
| result-gate | ok, 1104 px | ok, 1045 px | ok, 1025 px | ok, 901 px | ok, 901 px |
| result-plan | ok, 1990 px | ok, 1793 px | ok, 1577 px | ok, 1577 px | ok, 1577 px |
| result-savings | ok, 1269 px | ok, 1111 px | ok, 1025 px | ok, 1010 px | ok, 1010 px |

0 of 25 pages scroll sideways. Each cell: horizontal overflow (document scrollWidth beyond the viewport), then page height. Full-page screenshots are in responsive/.

## INP probe

Not run.

## What a borrower sees and when

| Scenario | First paint | Real content | Readable | LCP (in page) |
|---|---|---|---|---|
| First visit (1 of 1 loads failed) | – | – | – | – |
| Returning, eight loans (1 of 1 loads failed) | – | – | – | – |

One cold load per scenario, each in a fresh browser, on slow 4G and 4x CPU applied for real with devtools throttling, at 412x823 and DPR 1.75; ms from navigation start. First paint is Paint Timing's first-paint, the skeleton here. Real content is the first frame with `main h1` and no skeleton, readable the first frame with the first `.rise` block fully faded in. FCP and the other marks are in readable.json.

Lighthouse's simulated LCP sees only the skeleton for this app (1860 ms on the quiz mobile page in this run), so the Scoreboard's LCP is not when a borrower can read anything: the Readable column is.

## Site tools

| Tool | Result |
|---|---|
| header-check | score 40: 4 good, 1 warnings, 5 missing |
| meta-validate | score 73: 11 good, 2 warnings, 2 missing |
| structured-data | 0 schemas, 0 errors, 0 warnings |
| sitemap-validate | not found (Sitemap not found at https://invest-ready.vercel.app/sitemap.xml. HTTP 404) |
| redirect-check | 0 redirects, final status 200: No redirects detected. URL resolves directly. |
| broken-links | 11 links, 0 broken, 0 redirects, 0 errors, 0 timeouts |
| webmcp-check | AI readiness 0 |
