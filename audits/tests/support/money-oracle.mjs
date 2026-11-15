// An independent money oracle for Invest Ready, written from the sources in audits/REPORT.md and never from the
// app's code. If the app and this file disagree, one of them is wrong; check the source before changing either.

/**
 * Value after `years` of `monthly` deposited at the end of each month, at an annual return that compounds to
 * `annual` over a year. The monthly rate is (1 + annual)^(1/12) - 1, so twelve months compound to exactly `annual`.
 * Future value of an ordinary annuity: P * ((1 + r)^n - 1) / r.
 */
export function futureValue(monthly, years, annual = 0.07) {
  if (!(monthly > 0)) return 0;
  const r = (1 + annual) ** (1 / 12) - 1;
  const n = years * 12;
  return monthly * (((1 + r) ** n - 1) / r);
}

export const dollars = n => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * The account a student should be pointed to, from the rules this tool follows and their sources:
 * - no income: not yet (no steady money to invest from)
 * - less than one month saved: not yet (the tool's floor; FINRA and the SEC suggest three to six months)
 * - any debt above 8%: not yet (SEC roadmap: pay off high-interest debt first)
 * - money needed within 5 years: savings (SEC roadmap: goals five years or less, avoid risky investments)
 * - retirement with pay from work: Roth IRA; retirement with no pay from work: brokerage, because IRA contributions
 *   need taxable compensation (IRS Publication 590-A)
 * - anything else: brokerage
 */
export function expectedAccount({ income, cushion, debt, goal }) {
  if (income === 'none') return 'not-yet';
  if (cushion !== 'month') return 'not-yet';
  if (debt === 'high') return 'not-yet';
  if (goal === 'soon') return 'savings';
  if (goal === 'retirement') return income === 'family' ? 'brokerage' : 'roth';
  return 'brokerage';
}
