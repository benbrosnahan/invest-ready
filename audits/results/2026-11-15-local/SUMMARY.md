# Audit summary

- Target: http://localhost:3201/ (given with --url)
- Started: 2026-11-15T18:31:49.167Z
- Command: `node run.mjs --url http://localhost:3201/ --runs 1`
- Budgets: PASS: 27 passed, 0 failed

| Step | Result | Time |
|---|---|---|
| lighthouse | ok | 24.9 s |
| flow | ok | 94.9 s |
| security | ok | under 0.1 s |
| geo | ok | 10.8 s |
| design | ok | 105.6 s |
| ux | ok | under 0.1 s |
| tools | ok | 0.7 s |
| responsive | ok | 112.2 s |
| readable | ok | 8.1 s |

## Scoreboard

| Page | Perf | A11y | BP | SEO | LCP | FCP | CLS |
|---|---|---|---|---|---|---|---|
| Quiz, mobile | 100 | 100 | 100 | 100 | 756 ms | 756 ms | 0 |
| Quiz, desktop | 100 | 100 | 100 | 100 | 214 ms | 214 ms | 0 |
| Result, mobile | 98 | 100 | 100 | 66 | 2240 ms | 758 ms | 0 |
| Result, desktop | 100 | 100 | 100 | 66 | 507 ms | 206 ms | 0 |

Median of 1 Lighthouse run per page, chosen by performance score. Quiz is a first visit to /; result is /results with a Roth IRA plan's answers in sessionStorage before load. TBT: quiz, mobile 13 ms, quiz, desktop 0 ms, result, mobile 82 ms, result, desktop 0 ms.

## Budgets

| Budget | Measured | Limit | Result |
|---|---|---|---|
| Performance, quiz, mobile | 100 | ≥ 90 | pass |
| Accessibility, quiz, mobile | 100 | ≥ 100 | pass |
| Best practices, quiz, mobile | 100 | ≥ 95 | pass |
| SEO, quiz, mobile | 100 | ≥ 100 | pass |
| LCP, quiz, mobile | 756 ms | ≤ 2500 ms | pass |
| FCP, quiz, mobile | 756 ms | ≤ 1800 ms | pass |
| CLS, quiz, mobile | 0 | ≤ 0.1 | pass |
| TBT, quiz, mobile | 13 ms | ≤ 200 ms | pass |
| Performance, quiz, desktop | 100 | ≥ 90 | pass |
| Accessibility, quiz, desktop | 100 | ≥ 100 | pass |
| Best practices, quiz, desktop | 100 | ≥ 95 | pass |
| SEO, quiz, desktop | 100 | ≥ 100 | pass |
| Performance, result, mobile | 98 | ≥ 90 | pass |
| Accessibility, result, mobile | 100 | ≥ 100 | pass |
| Best practices, result, mobile | 100 | ≥ 95 | pass |
| LCP, result, mobile | 2240 ms | ≤ 2500 ms | pass |
| FCP, result, mobile | 758 ms | ≤ 1800 ms | pass |
| CLS, result, mobile | 0 | ≤ 0.1 | pass |
| TBT, result, mobile | 82 ms | ≤ 200 ms | pass |
| Performance, result, desktop | 100 | ≥ 90 | pass |
| Accessibility, result, desktop | 100 | ≥ 100 | pass |
| Best practices, result, desktop | 100 | ≥ 95 | pass |
| Flow INP (worst timespan), mobile | 69 ms (Answer the five questions) | ≤ 200 ms | pass |
| Flow INP (worst timespan), desktop | 57 ms (Answer the five questions) | ≤ 200 ms | pass |
| First-load JS, route / | 103.1 kB (7 files, gzip) | ≤ 110 kB | pass |
| GEO score (floor) | 84 | ≥ 55 | pass |
| Readable, first visit (floor) | 1686 ms (median of 1 cold load) | ≤ 3500 ms | pass |

Floors are not goals: they are the live site scores on 2026-11-15, before the audit fixes, so falling below one means something regressed.
The readable floor is a time, so going over it fails. It sits well above measured times, because throttled loads on a shared machine are noisy: a regression guard, not a goal.

Targets, which never fail a run:

| Measure | Now | Target | Status |
|---|---|---|---|
| GEO score | 84 | 80 | met |
| Readable, first visit | 1686 ms | 1600 ms | 86 ms to go |

## User flow

Lighthouse user flow: first load, the five questions answered to a Roth IRA plan, a monthly amount typed into the growth table, and the account guide opened. Timespans measure INP, CLS and TBT; snapshots audit the state for accessibility, best practices and SEO.

### Mobile

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (quiz) | navigation | 100 | 100 | 100 | 100 | – | 0 | 5 ms |
| Answer the five questions | timespan | 100 | – | 100 | – | 69 ms | 0 | 0 ms |
| Result (Roth IRA plan) | snapshot | – | 100 | 100 | 100 | – | – | – |
| Type a monthly amount | timespan | 100 | – | 100 | – | 28 ms | 0 | 0 ms |
| Open the account guide | timespan | 100 | – | 100 | – | 17 ms | 0 | 0 ms |
| Account guide open | snapshot | – | 100 | 100 | 100 | – | – | – |

Failing audits: Network dependency tree (First load (quiz)); Render-blocking requests (First load (quiz)).

### Desktop

| Step | Mode | Perf | A11y | BP | SEO | INP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| First load (quiz) | navigation | 100 | 100 | 100 | 100 | – | 0 | 0 ms |
| Answer the five questions | timespan | 100 | – | 100 | – | 57 ms | 0 | 0 ms |
| Result (Roth IRA plan) | snapshot | – | 100 | 100 | 100 | – | – | – |
| Type a monthly amount | timespan | 100 | – | 100 | – | 22 ms | 0 | 0 ms |
| Open the account guide | timespan | 100 | – | 100 | – | 20 ms | 0 | 0 ms |
| Account guide open | snapshot | – | 100 | 100 | 100 | – | – | – |

Failing audits: Network dependency tree (First load (quiz)).


## Security

**35** of 100. HTTPS 0, headers 0, cookies 100, content 100, dependencies not measured.

Lighthouse-based checks: included, from the median mobile Lighthouse run of the quiz page.

This target is plain HTTP, so TLS and every header read as missing whatever the server sends. Judge security with --target live.

- critical: Page not served over HTTPS
- critical: Missing Content-Security-Policy (0/10 points)
- critical: Missing Strict-Transport-Security (0/8 points)
- warning: Missing X-Content-Type-Options (0/4 points)
- warning: Missing X-Frame-Options (0/4 points)

## GEO

**84** of 100: crawl access 20/20, server content 28/30, structured data 16/20, social and meta 15/15, LLM discovery 0/10, indexability 5/5.

Words in the raw HTML: 103. Words once rendered: 103. Content parity 100%.

- warn: Heading Hierarchy (1/3)
- warn: Rich Schema Types (4/8)

## Design

| State | Desktop | Mobile | Score | Grade | Accessibility | Consistency | Motion | Performance |
|---|---|---|---|---|---|---|---|---|
| quiz | 91 A | 91 A | 91 | A | 88 | 88 | 88 | 100 |
| quiz-debt | 91 A | 91 A | 91 | A | 88 | 88 | 88 | 100 |
| result-gate | 85 B | 85 B | 85 | B | 76 | 76 | 88 | 100 |
| result-plan | 85 B | 85 B | 85 | B | 76 | 76 | 88 | 100 |
| result-savings | 85 B | 85 B | 85 | B | 76 | 76 | 88 | 100 |

Design engine 1.3.0. Score is the mean of the rounded desktop (1440x900) and mobile (375x812) scores; buckets are 0 to 100. The engine scores against Material 3 conventions and this app does not use Material, so a radius or target-size rule is advisory unless it is also a WCAG failure.

## UX deterministic

| Screen | Rule findings | P1 | P2 | P3 | Probe findings | Design |
|---|---|---|---|---|---|---|
| quiz-desktop | 3 | 0 | 3 | 0 | 1 | 91 |
| quiz-mobile | 3 | 0 | 3 | 0 | 0 | 91 |
| quiz-debt-desktop | 3 | 0 | 3 | 0 | 1 | 91 |
| quiz-debt-mobile | 3 | 0 | 3 | 0 | 0 | 91 |
| result-gate-desktop | 5 | 0 | 5 | 0 | 0 | 85 |
| result-gate-mobile | 5 | 0 | 5 | 0 | 0 | 85 |
| result-plan-desktop | 5 | 0 | 5 | 0 | 1 | 85 |
| result-plan-mobile | 5 | 0 | 5 | 0 | 0 | 85 |
| result-savings-desktop | 5 | 0 | 5 | 0 | 0 | 85 |
| result-savings-mobile | 5 | 0 | 5 | 0 | 0 | 85 |

Distinct findings, with how many screens show each:

- P2 1 animation/transition(s) under 50ms (non-instant but too fast to read). (10 screens)
- P2 1 to 2 border-radius value(s) off the 7-step scale (0/4/8/12/16/28/full). (10 screens)
- P2 Missing landmark(s): nav. (6 screens)
- P2 2 to 5 pointer target(s) smaller than M3's comfortable 48×48px at 1440px wide (5 screens)
- P2 3 to 7 reading-copy text node(s) below 16px (or any text below 11px). (6 screens)
- P2 2 to 5 tap target(s) smaller than M3's comfortable 48×48px at 375px wide (5 screens)
- P3 Primary controls show no hover feedback (3 screens)

These are rule findings only. UX scores come from the AI review, which reads ux/<screen>.jpg and ux/<screen>.dom.json and writes ux/ai/<screen>.json; then `node lib/merge-ux.mjs <results>/ux` scores and merges them.

## Responsive overflow

| State | 320 | 375 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| quiz | ok, 1043 px | ok, 944 px | ok, 1024 px | ok, 885 px | ok, 900 px |
| quiz-debt | ok, 986 px | ok, 879 px | ok, 1024 px | ok, 797 px | ok, 900 px |
| result-gate | ok, 1980 px | ok, 1765 px | ok, 1391 px | ok, 1391 px | ok, 1391 px |
| result-plan | ok, 2956 px | ok, 2681 px | ok, 2288 px | ok, 2288 px | ok, 2288 px |
| result-savings | ok, 1813 px | ok, 1572 px | ok, 1307 px | ok, 1307 px | ok, 1307 px |

0 of 25 pages scroll sideways. Each cell: horizontal overflow (document scrollWidth beyond the viewport), then page height. Full-page screenshots are in responsive/.

## INP probe

Not run.

## What a student sees and when

| Scenario | First paint | Real content | Readable | LCP (in page) |
|---|---|---|---|---|
| First visit | 1456 ms | 1438 ms | 1686 ms | 1892 ms |
| Returning, answers in the session | 1464 ms | 1447 ms | 1692 ms | 1904 ms |

One cold load per scenario, each in a fresh browser, on slow 4G and 4x CPU applied for real with devtools throttling, at 412x823 and DPR 1.75; ms from navigation start. First paint is Paint Timing's first-paint, the skeleton here. Real content is the first frame with `main h1` and no skeleton, readable the first frame with the first `.rise` block fully faded in. FCP and the other marks are in readable.json.

Lighthouse's simulated LCP sees only the skeleton for this app (756 ms on the quiz mobile page in this run), so the Scoreboard's LCP is not when a student can read anything: the Readable column is.

## Site tools

| Tool | Result |
|---|---|
| header-check | score 80: 8 good, 1 warnings, 1 missing |
| meta-validate | score 93: 14 good, 1 warnings, 0 missing |
| structured-data | 1 schemas, 0 errors, 1 warnings |
| sitemap-validate | found, 1 URLs, 1 issues |
| redirect-check | 0 redirects, final status 200: No redirects detected. URL resolves directly. |
| broken-links | 15 links, 0 broken, 0 redirects, 0 errors, 0 timeouts |
| webmcp-check | AI readiness 0 |

## Compared with results/2026-11-15-live

| Metric | Before | Now | Change |
|---|---|---|---|
| lighthouse.result-desktop.seo | 100 | 66 | -34 (worse) |
| lighthouse.result-mobile.lcp | 1827.476 | 2240.349 | +412.873 (worse) |
| lighthouse.result-mobile.performance | 100 | 98 | -2 (worse) |
| lighthouse.result-mobile.seo | 100 | 66 | -34 (worse) |
| lighthouse.result-mobile.tbt | 0 | 82 | +82 (worse) |
| lighthouse.result-mobile.tti | 1827.476 | 2390.349 | +562.873 (worse) |
| security.headers | 27 | 0 | -27 (worse) |
| security.https | 100 | 0 | -100 (worse) |
| security.score | 71 | 35 | -36 (worse) |
| ux.result-gate-desktop.p2 | 3 | 5 | +2 (worse) |
| ux.result-gate-mobile.p2 | 3 | 5 | +2 (worse) |
| ux.result-plan-desktop.p2 | 3 | 5 | +2 (worse) |
| ux.result-plan-mobile.p2 | 3 | 5 | +2 (worse) |
| ux.result-savings-desktop.p2 | 3 | 5 | +2 (worse) |
| ux.result-savings-mobile.p2 | 3 | 5 | +2 (worse) |
| design.quiz-debt.desktop | 68.1 | 91 | +22.9 (better) |
| design.quiz-debt.merged | 68 | 91 | +23 (better) |
| design.quiz-debt.mobile | 68.1 | 91 | +22.9 (better) |
| design.quiz.desktop | 68.1 | 91 | +22.9 (better) |
| design.quiz.merged | 68 | 91 | +23 (better) |
| design.quiz.mobile | 68.1 | 91 | +22.9 (better) |
| design.result-gate.desktop | 71.7 | 85 | +13.3 (better) |
| design.result-gate.merged | 72 | 85 | +13 (better) |
| design.result-gate.mobile | 71.7 | 85 | +13.3 (better) |
| design.result-plan.desktop | 71.7 | 85 | +13.3 (better) |
| design.result-plan.merged | 72 | 85 | +13 (better) |
| design.result-plan.mobile | 71.7 | 85 | +13.3 (better) |
| design.result-savings.desktop | 71.7 | 85 | +13.3 (better) |
| design.result-savings.merged | 72 | 85 | +13 (better) |
| design.result-savings.mobile | 71.7 | 85 | +13.3 (better) |
| flow.desktop.account-guide-open.accessibility | 89 | 100 | +11 (better) |
| flow.desktop.first-load-quiz.accessibility | 93 | 100 | +7 (better) |
| flow.desktop.result-roth-ira-plan.accessibility | 88 | 100 | +12 (better) |
| flow.mobile.account-guide-open.accessibility | 89 | 100 | +11 (better) |
| flow.mobile.first-load-quiz.accessibility | 93 | 100 | +7 (better) |
| flow.mobile.result-roth-ira-plan.accessibility | 88 | 100 | +12 (better) |
| flow.mobile.type-a-monthly-amount.inp | 79.036 | 28.458 | -50.578 (better) |
| geo.score | 55 | 84 | +29 (better) |
| geo.serverContent | 23 | 28 | +5 (better) |
| geo.socialMeta | 7 | 15 | +8 (better) |
| geo.structuredData | 0 | 16 | +16 (better) |
| lighthouse.quiz-desktop.accessibility | 93 | 100 | +7 (better) |
| lighthouse.quiz-desktop.lcp | 436.154 | 214.008 | -222.146 (better) |
| lighthouse.quiz-desktop.si | 294.427 | 214.008 | -80.419 (better) |
| lighthouse.quiz-desktop.tti | 436.154 | 214.008 | -222.146 (better) |
| lighthouse.quiz-mobile.accessibility | 93 | 100 | +7 (better) |
| lighthouse.quiz-mobile.fcp | 1110.449 | 755.913 | -354.536 (better) |
| lighthouse.quiz-mobile.lcp | 1860.449 | 755.913 | -1104.536 (better) |
| lighthouse.quiz-mobile.performance | 99 | 100 | +1 (better) |
| lighthouse.quiz-mobile.si | 1145.715 | 755.913 | -389.802 (better) |
| lighthouse.quiz-mobile.tti | 1860.449 | 1563.313 | -297.136 (better) |
| lighthouse.result-desktop.accessibility | 88 | 100 | +12 (better) |
| lighthouse.result-desktop.fcp | 282.542 | 206.241 | -76.301 (better) |
| lighthouse.result-desktop.si | 432.091 | 206.241 | -225.85 (better) |
| lighthouse.result-mobile.accessibility | 88 | 100 | +12 (better) |
| lighthouse.result-mobile.si | 1052.018 | 758.349 | -293.669 (better) |
| security.content | 80 | 100 | +20 (better) |
| tools.header-check.score | 40 | 80 | +40 (better) |
| tools.meta-validate.score | 73 | 93 | +20 (better) |
| tools.sitemap-validate.found | 0 | 1 | +1 (better) |
| tools.structured-data.totalSchemas | 0 | 1 | +1 (better) |
| ux.quiz-debt-desktop.findings | 6 | 3 | -3 (better) |
| ux.quiz-debt-desktop.p1 | 2 | 0 | -2 (better) |
| ux.quiz-debt-desktop.p2 | 4 | 3 | -1 (better) |
| ux.quiz-debt-mobile.findings | 6 | 3 | -3 (better) |
| ux.quiz-debt-mobile.p1 | 2 | 0 | -2 (better) |
| ux.quiz-debt-mobile.p2 | 4 | 3 | -1 (better) |
| ux.quiz-desktop.findings | 6 | 3 | -3 (better) |
| ux.quiz-desktop.p1 | 2 | 0 | -2 (better) |
| ux.quiz-desktop.p2 | 4 | 3 | -1 (better) |
| ux.quiz-mobile.findings | 6 | 3 | -3 (better) |
| ux.quiz-mobile.p1 | 2 | 0 | -2 (better) |
| ux.quiz-mobile.p2 | 4 | 3 | -1 (better) |
| ux.result-gate-desktop.p1 | 2 | 0 | -2 (better) |
| ux.result-gate-mobile.p1 | 2 | 0 | -2 (better) |
| ux.result-plan-desktop.p1 | 2 | 0 | -2 (better) |
| ux.result-plan-mobile.p1 | 2 | 0 | -2 (better) |
| ux.result-savings-desktop.p1 | 2 | 0 | -2 (better) |
| ux.result-savings-mobile.p1 | 2 | 0 | -2 (better) |

Timings within 50 ms or 10%, and CLS within 0.01, count as unchanged. 0 metrics exist only in the stored run and 11 only in this one (steps not run in both).
