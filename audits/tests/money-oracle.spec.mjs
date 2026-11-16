// The app against the independent oracle in support/money-oracle.mjs: the growth table's figures, and which account
// realistic students are pointed to. Expected values come from the oracle, never from the app's code.
import { test, expect, A, ROTH, resultFor, PHONE } from './helpers.mjs';
import { dollars, expectedAccount, expectedStop, futureValue } from './support/money-oracle.mjs';

test.use({ viewport: PHONE });

const YEARS = [10, 20, 30, 40];

async function tableValues(page) {
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(YEARS.length);
  return rows.evaluateAll(trs => trs.map(tr => {
    const cells = [...tr.querySelectorAll('td')];
    return cells[cells.length - 1].innerText.trim();
  }));
}

for (const monthly of [200, 50, 1234]) {
  test(`MONEY-07 growth table matches the annuity formula at 7% a year, $${monthly} a month`, async ({ page }) => {
    await resultFor(page, ...ROTH);
    const input = page.getByRole('textbox').first();
    await input.fill(String(monthly));
    await page.waitForTimeout(200);
    expect(await tableValues(page)).toEqual(YEARS.map(y => dollars(futureValue(monthly, y))));
  });
}

test('MONEY-07 the oracle reproduces the hand calculation in the report', () => {
  expect(dollars(futureValue(200, 40))).toBe('$494,308');
  expect(dollars(futureValue(200, 10))).toBe('$34,210');
});

test('growth table caps a pasted monthly amount instead of overflowing', async ({ page }) => {
  await resultFor(page, ...ROTH);
  await page.locator('#monthly').fill('123456789');
  await expect(page.locator('#monthly')).toHaveValue('12345');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});

// Realistic students. Labels for the quiz, facts for the oracle.
const PROFILES = [
  { who: 'Maya, campus job, federal loan, retirement', labels: ROTH, facts: { income: 'steady', cushion: 'month', debt: 'low', goal: 'retirement' } },
  { who: 'Sam, allowance only, retirement', labels: [A.family, A.noDebt, A.month, A.retirement, A.wait], facts: { income: 'family', cushion: 'month', debt: 'none', goal: 'retirement' } },
  { who: 'Priya, 11.5% private loan, a month saved', labels: [A.steady, A.highDebt, A.month], facts: { income: 'steady', debt: 'high', cushion: 'month' } },
  { who: 'Jordan, car in four years', labels: [A.varies, A.noDebt, A.month, A.soon], facts: { income: 'varies', cushion: 'month', debt: 'none', goal: 'soon' } },
  { who: 'Alex, card balance, no savings', labels: [A.steady, A.highDebt, A.noCushion], facts: { income: 'steady', debt: 'high', cushion: 'none' } },
  { who: 'Lee, gig work, house in 7 years', labels: [A.varies, A.lowDebt, A.month, A.bigGoal, A.pullOut], facts: { income: 'varies', cushion: 'month', debt: 'low', goal: 'big' } },
  { who: 'Kai, between jobs', labels: [A.noIncome], facts: { income: 'none' } },
  { who: 'Rae, some savings, no debt', labels: [A.varies, A.noDebt, A.some], facts: { income: 'varies', debt: 'none', cushion: 'some' } },
];

const STOP = { income: /Income comes first/, debt: /Pay off the costly debt first/, cushion: /Build a cushion first/ };

const SHOWN = {
  roth: /Open a Roth IRA/,
  brokerage: /Open a brokerage account/,
  savings: /Open a high-yield savings account/,
  'not-yet': /^Not yet\./,
};

for (const p of PROFILES) {
  test(`routing: ${p.who}`, async ({ page }) => {
    await resultFor(page, ...p.labels);
    const expected = expectedAccount(p.facts);
    if (expected === 'not-yet') {
      await expect(page.locator('h1')).toHaveText(SHOWN[expected]);
      await expect(page.locator('h1')).toHaveText(STOP[expectedStop(p.facts)]);
    }
    else await expect(page.getByRole('heading', { name: SHOWN[expected] })).toBeVisible();
  });
}
