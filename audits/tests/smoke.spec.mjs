// Smoke: every path through the quiz reaches a readable result, and the things that worked before still work.
import { test, expect, A, ROTH, option, pick, answers, resultFor, knownIssue, PHONE } from './helpers.mjs';

test.use({ viewport: PHONE });

test('the quiz opens on the first question with a page heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toHaveText('Are you ready to start investing?');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Do you have a regular source of income right now?');
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
});

const PATHS = [
  ['no income', [A.noIncome], /^Not yet\. Income comes first\./],
  ['costly debt', [A.steady, A.highDebt], /^Not yet\. Pay off the costly debt first\./],
  ['no cushion', [A.steady, A.noDebt, A.noCushion], /^Not yet\. Build a cushion first\./],
  ['money needed soon', [A.steady, A.noDebt, A.month, A.soon], /^Save it for now\./],
  ['ready, Roth IRA', ROTH, /^You look ready to invest\./],
  ['ready, brokerage', [A.varies, A.noDebt, A.month, A.bigGoal, A.buyMore], /^You look ready to invest\./],
];

for (const [name, labels, headline] of PATHS) {
  test(`path: ${name}`, async ({ page }) => {
    await resultFor(page, ...labels);
    await expect(page.locator('main h1')).toHaveText(headline);
    // Every rung of the ladder is listed, in order.
    await expect(page.getByRole('list', { name: 'Your steps, in order' }).getByRole('listitem')).toHaveCount(5);
  });
}

test('Back returns to the last question with the answer still marked', async ({ page }) => {
  await answers(page, A.steady, A.lowDebt);
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByText('Question 2 of 5')).toBeVisible();
  await expect(option(page, A.lowDebt)).toHaveAttribute('aria-pressed', 'true');
});

test('a result survives a reload, and Start over returns to the first question', async ({ page }) => {
  await resultFor(page, ...ROTH);
  await page.reload();
  await expect(page.locator('main h1')).toHaveText(/You look ready to invest/);
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
});

test('the results page with no answers sends you to the quiz', async ({ page }) => {
  await page.goto('/results');
  await page.waitForURL(url => !url.pathname.startsWith('/results'));
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
});

test('the account guide opens and links to providers in a new tab', async ({ page }) => {
  await resultFor(page, ...ROTH);
  const toggle = page.getByRole('button', { name: /How to open your account/ });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const links = page.getByRole('link', { name: /^Open at / });
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('a fund explains itself in place', async ({ page }) => {
  await resultFor(page, ...ROTH);
  const about = page.getByRole('button', { name: 'What is VTI?' });
  await about.click();
  await expect(about).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('About 3,500 US companies')).toBeVisible();
});

test('content is visible without waiting on scripts: nothing is left at opacity 0', async ({ page }) => {
  await resultFor(page, ...ROTH);
  await page.waitForTimeout(1500);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main *')].filter(el => el.checkVisibility?.() && Number(getComputedStyle(el).opacity) < 0.99).length
  );
  expect(hidden).toBe(0);
});

for (const width of [320, 375]) {
  test(`no sideways scrolling at ${width}px on the quiz and a full result`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const over = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(await over()).toBe(0);
    for (const label of ROTH) await pick(page, label);
    await page.waitForURL('**/results');
    await page.getByRole('button', { name: /How to open your account/ }).click();
    expect(await over()).toBe(0);
  });
}

test('no console errors through a full journey', async ({ page }) => {
  const errors = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(String(e)));
  await resultFor(page, ...ROTH);
  await page.getByRole('button', { name: /How to open your account/ }).click();
  expect(errors).toEqual([]);
});

test('SCOPE-01 a result can be shared by link', async ({ page, browser }) => {
  knownIssue('SCOPE-01');
  await resultFor(page, ...ROTH);
  const other = await browser.newPage();
  await other.goto(page.url());
  await expect(other.locator('main h1')).toHaveText(/You look ready to invest/, { timeout: 3000 });
  await other.close();
});
