// Money and claims: one test per finding in audits/REPORT.md. Each asserts the fixed behaviour through the real
// interface, so it fails on the pre-audit build (AUDIT_URL=https://invest-ready.vercel.app) and passes after.
import { test, expect, A, ROTH, GROWTH_BROKERAGE, CONSERVATIVE, option, pick, answers, resultFor, text, PHONE } from './helpers.mjs';

test.use({ viewport: PHONE });

test('MONEY-01 a double-click answers once: the debt question is never skipped', async ({ page }) => {
  await page.goto('/');
  await pick(page, A.steady);
  await option(page, A.month).dblclick();
  await page.waitForTimeout(900);
  await expect(page.getByText(/(Question|Step) 3 of 5/)).toBeVisible();
  await expect(page.getByRole('heading', { level: 2 })).toContainText(/debt|interest/i);
});

test('MONEY-01 a quick second click on another answer does not skip ahead either', async ({ page }) => {
  await page.goto('/');
  // Both clicks in one task, so machine load cannot let the first move land between them.
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll('button, [role="radio"]')];
    const find = start => cards.find(b => b.textContent.trim().startsWith(start));
    find("Yes, it's consistent").click();
    find('Yes, but it varies').click();
  });
  await page.waitForTimeout(900);
  await expect(page.getByText(/(Question|Step) 2 of 5/)).toBeVisible();
  // The last click is the answer kept.
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(option(page, A.varies)).toHaveAttribute('aria-pressed', 'true');
});

test('MONEY-02 a student whose only money is an allowance is not sent to a Roth IRA', async ({ page }) => {
  await page.goto('/');
  // Whichever card mentions an allowance: before the fix it was "Yes, it's consistent".
  await page.getByRole('button', { name: /allowance/i }).or(page.getByRole('radio', { name: /allowance/i })).first().click();
  await page.waitForTimeout(500);
  for (const label of [A.month, A.noDebt, A.retirement, A.wait]) await pick(page, label);
  await page.waitForURL('**/results');
  const body = await text(page);
  expect(body).not.toMatch(/Open a Roth IRA|Recommended account Roth IRA/);
  expect(body).toMatch(/brokerage account/i);
  expect(body).toMatch(/Roth IRA (takes|needs) only pay from work/);
});

test('MONEY-03 and MONEY-11 the Roth result states the cap as $7,500 or pay from work if less, without opening anything', async ({ page }) => {
  await resultFor(page, ...ROTH);
  const rule = page.getByText(/up to \$7,500, or what you earned from work this year if that is less/);
  await expect(rule).toBeVisible();
  await expect(page.getByText(/6% tax on the extra/)).toBeVisible();
});

test('MONEY-04 the debt question asks by rate and puts private student loans on the high side', async ({ page }) => {
  await answers(page, A.steady, A.month);
  await expect(option(page, A.lowDebt)).not.toHaveAccessibleName(/student loans,/i);
  await expect(option(page, A.lowDebt)).toHaveAccessibleName(/federal undergrad loans/i);
  await expect(option(page, A.highDebt)).toHaveAccessibleName(/private student/i);
});

test('MONEY-05 money needed within 5 years goes to savings, and a big goal means 5 to 10 years away', async ({ page }) => {
  await answers(page, A.steady, A.month, A.noDebt);
  await expect(option(page, A.bigGoal)).toHaveAccessibleName(/5 to 10 years/);
  await expect(option(page, A.soon)).toHaveAccessibleName(/^Might need it within 5 years/);
  await pick(page, A.soon);
  await page.waitForURL('**/results');
  await expect(page.getByText(/high-yield savings account/i).first()).toBeVisible();
});

test('MONEY-06 savings rates are current, dated, and SoFi shows its direct-deposit condition', async ({ page }) => {
  await resultFor(page, A.steady, A.noCushion);
  const body = await text(page);
  expect(body).toContain('3.55%');
  expect(body).toContain('3.50%');
  expect(body).toMatch(/SoFi Savings Needs direct deposit.*Otherwise 0\.80%/);
  expect(body).toContain('November 15, 2026');
  expect(body).not.toContain('June 2026');
});

test('MONEY-08 the growth assumption is called an after-inflation figure, with a caveat for bond-heavy mixes', async ({ page }) => {
  await resultFor(page, ...CONSERVATIVE);
  const body = await text(page);
  expect(body).toMatch(/after inflation/);
  expect(body).toMatch(/bond-heavy mix like yours has usually grown less/);
  expect(body).not.toMatch(/S&P 500 historical average\)/);
});

test('MONEY-09 the cushion result says one month is a start and three to six months is the aim', async ({ page }) => {
  await resultFor(page, A.steady, A.some);
  await expect(page.getByText(/three to six months/)).toBeVisible();
});

test('MONEY-10 a yes result mentions getting a full employer match first', async ({ page }) => {
  await resultFor(page, ...ROTH);
  await expect(page.getByText(/401\(k\) match/)).toBeVisible();
});

test('MONEY-12 the brokerage result says gains may be taxed and the value can fall', async ({ page }) => {
  await resultFor(page, ...GROWTH_BROKERAGE);
  const body = await text(page);
  expect(body).toMatch(/tax on gains/);
  expect(body).toMatch(/worth less when you need it/);
});

test('MONEY-13 fund fees and names match the September 2026 fact sheets', async ({ page }) => {
  await resultFor(page, ...GROWTH_BROKERAGE);
  const html = await page.content();
  const fee = ticker => page.locator('li').filter({ has: page.getByRole('button', { name: `What is ${ticker}?`, exact: true }) });
  await expect(fee('VT')).toContainText('0.06%');
  await expect(fee('VXUS')).toContainText('0.05%');
  await expect(fee('VTI')).toContainText('0.03%');
  expect(html).toContain('Vanguard Morningstar Total Stock Market ETF');
});

test('MONEY-14 BND is not described as predictable, and says it can lose value', async ({ page }) => {
  await resultFor(page, ...CONSERVATIVE);
  const html = await page.content();
  expect(html).not.toMatch(/more predictable returns/);
  expect(html).toMatch(/can lose value/);
});

test("MONEY-15 the account guide names Vanguard's $25 yearly fee", async ({ page }) => {
  await resultFor(page, ...GROWTH_BROKERAGE);
  await page.getByRole('button', { name: /How to open your account/ }).click();
  await expect(page.getByText(/Vanguard charges \$25 a year unless you choose e-delivery/)).toBeVisible();
});

test('MONEY-16 savings are not called risk-free and the list is not called "top"', async ({ page }) => {
  await resultFor(page, A.noIncome);
  const body = await text(page);
  expect(body).not.toMatch(/no risk/i);
  expect(body).not.toMatch(/top high-yield/i);
  expect(body).toMatch(/FDIC insured/);
});

test('MONEY-17 the cushion result tells a student with a card balance that paying it comes next', async ({ page }) => {
  await resultFor(page, A.steady, A.noCushion);
  await expect(page.getByText(/credit card balance/i)).toBeVisible();
});

test("MONEY-18 the debt question quotes the Fed's average card rate", async ({ page }) => {
  await answers(page, A.steady, A.month);
  await expect(page.getByText(/average about 22%/)).toBeVisible();
});

test('MONEY-19 the yes result is worded as a reading of the answers, not a certainty', async ({ page }) => {
  await resultFor(page, ...ROTH);
  await expect(page.locator('h1')).not.toHaveText(/^You're ready/);
  const body = await text(page);
  expect(body).toMatch(/Based on your answers/);
  expect(body).not.toMatch(/\bideal\b|the right fit|keeps your portfolio stable/);
});

test('MONEY-20 fund descriptions do not overreach', async ({ page }) => {
  await resultFor(page, ...GROWTH_BROKERAGE);
  const html = await page.content();
  expect(html).toMatch(/more than 47 countries/);
  expect(html).not.toMatch(/every country/);
});
