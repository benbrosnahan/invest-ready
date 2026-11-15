// Shared helpers for the Playwright suite. Each test gets a fresh browser context, so storage starts empty.
// Answers are picked by the start of their visible label, which reads the same to a person and a screen reader.
import { test, expect } from '@playwright/test';

export { test, expect };

export const PHONE = { width: 375, height: 812 };
export const DESKTOP = { width: 1440, height: 900 };

/**
 * Marks a test as a known issue from audits/REPORT.md. The test asserts the fixed behaviour, so today it fails and
 * Playwright counts that as expected. Once the issue is fixed, Playwright reports "expected to fail, but passed":
 * delete the knownIssue() call. AUDIT_SHOW_KNOWN=1 runs known issues as ordinary tests, to read the real failure.
 */
export function knownIssue(id) {
  test.info().annotations.push({ type: 'issue', description: id });
  test.fail(!process.env.AUDIT_SHOW_KNOWN, `Known issue ${id}: see audits/REPORT.md`);
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** An answer card. The pre-audit build used role="radio"; the audited build uses buttons. */
export function option(page, label) {
  const name = label instanceof RegExp ? label : new RegExp(`^${escapeRe(label)}`);
  return page.getByRole('button', { name }).or(page.getByRole('radio', { name })).first();
}

export async function pick(page, label) {
  await option(page, label).click();
  // The quiz moves on about 200 ms after a click; wait until the old question has gone.
  await page.waitForTimeout(500);
}

/** Answers that reach each kind of result, as label prefixes shared by the pre-audit and audited copy where possible. */
export const A = {
  steady: "Yes, it's consistent",
  varies: 'Yes, but it varies',
  family: 'Only from family or aid',
  noIncome: 'Not right now',
  month: 'Yes, I have at least one month',
  some: 'I have some savings',
  noCushion: 'No savings cushion yet',
  highDebt: /^Yes, (some above 8%|high-interest debt)/,
  lowDebt: /^Only (debt under 8%|low-interest debt)/,
  noDebt: /^No debt/,
  retirement: 'Retirement',
  bigGoal: 'A big goal',
  wealth: 'Growing my wealth',
  soon: 'Might need it within',
  pullOut: 'Pull it out',
  wait: 'Leave it and wait',
  buyMore: 'Put more in',
};

export async function answers(page, ...labels) {
  await page.goto('/');
  for (const label of labels) await pick(page, label);
}

/** Answers, then waits for the result page to render its headline. */
export async function resultFor(page, ...labels) {
  await answers(page, ...labels);
  await page.waitForURL('**/results');
  await expect(page.locator('h1').first()).toBeVisible();
}

export const ROTH = [A.steady, A.month, A.lowDebt, A.retirement, A.wait];
export const GROWTH_BROKERAGE = [A.steady, A.month, A.noDebt, A.wealth, A.buyMore];
export const CONSERVATIVE = [A.steady, A.month, A.noDebt, A.wealth, A.pullOut];

/** The page's visible text, whitespace collapsed. */
export const text = async page => (await page.locator('body').innerText()).replace(/\s+/g, ' ');
