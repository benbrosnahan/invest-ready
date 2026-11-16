// Shareable results (SCOPE-01). A result's link carries the answers in the URL fragment and nothing else, and whoever
// opens it gets the same verdict. Expected verdicts come from the independent oracle, and the link format is written
// here from its definition (question=choice pairs after the #), never imported from the app.
import { test, expect, A, ROTH, resultFor, text, PHONE } from './helpers.mjs';
import { expectedAccount, expectedStop } from './support/money-oracle.mjs';

test.use({ viewport: PHONE });

// The quiz's questions in order, with every choice and the oracle's name for it.
const CHOICES = {
  income: { consistent: 'steady', variable: 'varies', unearned: 'family', none: 'none' },
  debt: { high_interest: 'high', low_interest: 'low', none: 'none' },
  emergency: { funded: 'month', partial: 'some', none: 'none' },
  goal: { retirement: 'retirement', big_goal: 'big', wealth: 'wealth', soon: 'soon' },
  risk: { conservative: 'conservative', moderate: 'moderate', growth: 'growth' },
};
const ORDER = Object.keys(CHOICES);

// Where the quiz stops, from the rules the oracle encodes: no income, debt above 8%, under a month saved, money
// needed within five years, or the last question.
const stopsAt = (q, facts) =>
  (q === 'income' && facts.income === 'none') ||
  (q === 'debt' && facts.debt === 'high') ||
  (q === 'emergency' && facts.cushion !== 'month') ||
  (q === 'goal' && facts.goal === 'soon') ||
  q === 'risk';

/** Every distinct way through the quiz: 76 answer sets, each as the pairs a link carries and the oracle's facts. */
function allPaths() {
  const out = [];
  const walk = (i, pairs, facts) => {
    const q = ORDER[i];
    for (const [value, fact] of Object.entries(CHOICES[q])) {
      const f = { ...facts, [q === 'emergency' ? 'cushion' : q]: fact };
      const p = [...pairs, [q, value]];
      if (stopsAt(q, f)) out.push({ pairs: p, facts: f });
      else walk(i + 1, p, f);
    }
  };
  walk(0, [], {});
  return out;
}
const link = pairs => `/results#${new URLSearchParams(pairs).toString()}`;

const STOP = { income: /^Not yet\. Income comes first\./, debt: /^Not yet\. Pay off the costly debt first\./, cushion: /^Not yet\. Build a cushion first\./ };
const ACCOUNT = { roth: 'Open a Roth IRA', brokerage: 'Open a brokerage account', savings: 'Open a high-yield savings account' };

test('SCOPE-01 every possible link opens to the verdict the rules give, read fresh by someone else', async ({ page }) => {
  const paths = allPaths();
  expect(paths).toHaveLength(76);
  let first = true;
  for (const { pairs, facts } of paths) {
    // The first link is a fresh load; the rest change only the fragment, as an edited or followed link would.
    await page.goto(link(pairs));
    if (first) await expect(page.getByText('Someone shared this answer with you')).toBeVisible();
    first = false;
    const h1 = page.locator('main h1');
    const expected = expectedAccount(facts);
    const label = pairs.map(p => p.join('=')).join('&');
    if (expected === 'not-yet') {
      await expect(h1, label).toHaveText(STOP[expectedStop(facts)]);
    } else {
      await expect(page.getByRole('heading', { level: 2, name: ACCOUNT[expected] }), label).toBeVisible();
      if (expected === 'savings') await expect(h1, label).toHaveText(/^Save it for now\./);
      else await expect(h1, label).toHaveText(/^You look ready to invest\./);
    }
  }
});

const TAMPERED = {
  'only the first answer': 'income=consistent',
  'stops before a result': 'income=consistent&debt=none&emergency=funded&goal=retirement',
  'a choice the quiz does not offer': 'income=consistent&debt=none&emergency=funded&goal=retirement&risk=yolo',
  'an answer past where the quiz stops': 'income=consistent&debt=high_interest&emergency=funded',
  'the same question twice': 'income=none&income=consistent&debt=none&emergency=funded&goal=soon',
  'an extra field': 'income=none&name=Sam',
  'a script': 'income=%3Cscript%3Ealert(1)%3C%2Fscript%3E',
  'not pairs at all': 'hello',
  'broken escapes': 'income=%E0%A4%A',
};

for (const [name, fragment] of Object.entries(TAMPERED)) {
  test(`SCOPE-01 a tampered or partial link shows no verdict: ${name}`, async ({ page }) => {
    const dialogs = [];
    page.on('dialog', d => { dialogs.push(d.message()); d.dismiss(); });
    await page.goto(`/results#${fragment}`);
    await expect(page.locator('main h1')).toHaveText('This link does not hold a full answer');
    expect(await text(page)).not.toMatch(/Not yet\.|You look ready|Save it for now/);
    expect(page.url()).toContain('/results');
    expect(dialogs).toEqual([]);
    await page.getByRole('button', { name: 'Take the quiz' }).click();
    await expect(page.getByText('Question 1 of 5')).toBeVisible();
  });
}

test('SCOPE-01 Copy link copies the address of this result, and the copy opens to the same answer', async ({ page, browser, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseURL).origin });
  await resultFor(page, ...ROTH);
  // The tab that answered sees its own answer, not the shared one.
  await expect(page.getByText('Someone shared this answer with you')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Start over' })).toBeVisible();
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(page.getByRole('button', { name: 'Link copied' })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(page.url());
  expect(copied).toBe(`${new URL(baseURL).origin}/results#income=consistent&debt=low_interest&emergency=funded&goal=retirement&risk=moderate`);

  const other = await browser.newContext({ viewport: PHONE });
  const friend = await other.newPage();
  await friend.goto(copied);
  await expect(friend.locator('main h1')).toHaveText(/^You look ready to invest\./);
  await expect(friend.getByRole('heading', { name: 'Open a Roth IRA' })).toBeVisible();
  await expect(friend.getByText('Someone shared this answer with you')).toBeVisible();
  await expect(friend.getByText('Based on their answers')).toBeVisible();
  // Opening a shared link stores nothing in the friend's browser.
  expect(await friend.evaluate(() => [sessionStorage.length, localStorage.length])).toEqual([0, 0]);
  await friend.getByRole('button', { name: 'Take the quiz yourself' }).click();
  await expect(friend.getByText('Question 1 of 5')).toBeVisible();
  await other.close();
});

test('SCOPE-01 when the clipboard is blocked, the link is shown to copy by hand', async ({ page }) => {
  await resultFor(page, A.steady, A.highDebt);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('blocked')) } });
  });
  await page.getByRole('button', { name: 'Copy link' }).click();
  const field = page.getByLabel('Copy this link');
  await expect(field).toHaveValue(page.url());
  await expect(field).toHaveValue(/#income=consistent&debt=high_interest$/);
});

test('SCOPE-01 a result opened without a link gets one in the address bar', async ({ page }) => {
  await resultFor(page, A.steady, A.noDebt, A.noCushion);
  await page.goto('/results');
  await expect(page.locator('main h1')).toHaveText(/^Not yet\. Build a cushion first\./);
  await expect(page).toHaveURL(/\/results#income=consistent&debt=none&emergency=none$/);
});

test('SCOPE-01 the link carries only the coarse answers, in the fragment, and no request carries them', async ({ page, baseURL }) => {
  const requested = [];
  page.on('request', r => requested.push(r.url()));
  await resultFor(page, ...ROTH);
  const url = new URL(page.url());
  expect(url.pathname).toBe('/results');
  expect(url.search).toBe('');
  const pairs = [...new URLSearchParams(url.hash.slice(1))];
  expect(pairs.map(([k]) => k)).toEqual(ORDER);
  for (const [k, v] of pairs) expect(Object.keys(CHOICES[k])).toContain(v);
  // The fragment is never sent: no request, to this site or any other, holds an answer.
  await page.getByRole('button', { name: /How to open your account/ }).click();
  expect(requested.filter(u => /income=|emergency=|debt=|risk=/.test(u))).toEqual([]);
  expect(requested.every(u => !u.includes('#'))).toBe(true);
  // Outbound links are plain addresses, with no answers in them.
  const hrefs = await page.locator('a[href^="http"]').evaluateAll(as => as.map(a => a.href));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.filter(h => /income=|consistent|low_interest/.test(h))).toEqual([]);
  expect(new URL(baseURL).origin).toBe(url.origin);
});

test('SCOPE-01 the shared page preview names the tool, never a verdict, and stays out of search', async ({ request }) => {
  const html = await (await request.get('/results')).text();
  const meta = (attr, key) => html.match(new RegExp(`<meta[^>]+${attr}="${key}"[^>]+content="([^"]*)"`))?.[1] ?? '';
  expect(meta('property', 'og:title')).toBe('An answer from Invest Ready by Cense');
  expect(meta('property', 'og:image')).toMatch(/\/opengraph-image/);
  expect(meta('name', 'robots')).toMatch(/noindex/);
  for (const words of [/Not yet/, /ready to invest/, /Roth/, /cushion first/]) {
    expect(meta('property', 'og:title') + meta('property', 'og:description')).not.toMatch(words);
  }
});
