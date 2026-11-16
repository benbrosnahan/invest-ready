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
 * The account a student should be pointed to, from the rules this tool follows and their sources, in the order
 * they apply:
 * - no income: not yet (no steady money to invest from)
 * - less than one month saved: not yet, build the cushion first, even with costly debt (Ben's rule, 2026-11-16:
 *   being able to afford an emergency comes first, so a surprise bill does not go back on the card; FINRA says to
 *   balance the two; the SEC roadmap puts costly debt first, which this tool knowingly departs from). One month is
 *   the tool's floor; FINRA suggests three to six months.
 * - any debt above 8%: not yet, pay it down (SEC roadmap: "Pay off any high interest debts", about 8% or above,
 *   before investing)
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

/** Which step a "not yet" stops at, in the same order as above, or null when the answer is not a "not yet". */
export function expectedStop({ income, cushion, debt }) {
  if (income === 'none') return 'income';
  if (cushion !== 'month') return 'cushion';
  if (debt === 'high') return 'debt';
  return null;
}
