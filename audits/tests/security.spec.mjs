// Security and privacy: the headers the kit's scan scores, and the "On your device" promise checked in a real
// journey. Next's version is checked as a known issue (SEC-02) so the upgrade stays on the list.
import { readFileSync } from 'node:fs';
import { test, expect, ROTH, resultFor, knownIssue } from './helpers.mjs';

test('SEC-01 pages send a CSP and the baseline security headers', async ({ request }) => {
  for (const path of ['/', '/results']) {
    const res = await request.get(path);
    const h = res.headers();
    expect(h['content-security-policy'], path).toMatch(/default-src 'self'/);
    expect(h['content-security-policy'], path).toMatch(/connect-src 'self'/);
    expect(h['content-security-policy'], path).toMatch(/frame-ancestors 'none'/);
    expect(h['x-content-type-options'], path).toBe('nosniff');
    expect(h['x-frame-options'], path).toBe('DENY');
    expect(h['referrer-policy'], path).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy'], path).toMatch(/camera=\(\)/);
    expect(h['x-powered-by'], path).toBeUndefined();
  }
});

test('the answers never leave the browser: a full journey requests nothing from another origin', async ({ page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  const elsewhere = [];
  page.on('request', r => {
    const u = new URL(r.url());
    if (!['data:', 'blob:'].includes(u.protocol) && u.origin !== origin) elsewhere.push(r.url());
  });
  await resultFor(page, ...ROTH);
  await page.locator('#monthly').fill('350');
  await page.getByRole('button', { name: /How to open your account/ }).click();
  expect(elsewhere).toEqual([]);
});

test('the answers are kept for this tab only, as answers, not in the URL', async ({ page }) => {
  await resultFor(page, ...ROTH);
  expect(page.url()).not.toMatch(/[?#]/);
  const local = await page.evaluate(() => Object.keys(localStorage));
  expect(local).toEqual([]);
  const session = await page.evaluate(() => JSON.parse(sessionStorage.getItem('invest-ready-answers')));
  expect(Object.keys(session).sort()).toEqual(['debt', 'emergency', 'goal', 'income', 'risk']);
});

test('SEC-02 Next.js is on a supported major version', () => {
  knownIssue('SEC-02');
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  expect(Number(String(pkg.dependencies.next).replace(/^\D*/, '').split('.')[0])).toBeGreaterThanOrEqual(16);
});
