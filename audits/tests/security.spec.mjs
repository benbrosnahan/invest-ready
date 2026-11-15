// Security and privacy: the headers the kit's scan scores, and the "On your device" promise checked in a real
// journey, and Next's version (SEC-02) so a downgrade is caught.
import { readFileSync } from 'node:fs';
import { test, expect, ROTH, resultFor } from './helpers.mjs';

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

test('SEC-02 Next.js is on a supported major version, as declared and as installed', () => {
  const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
  const major = v => Number(String(v).replace(/^\D*/, '').split('.')[0]);
  const pkg = read('../../package.json');
  expect(major(pkg.dependencies.next)).toBeGreaterThanOrEqual(16);
  expect(major(read('../../node_modules/next/package.json').version)).toBeGreaterThanOrEqual(16);
  // Next 16 needs React 19.
  expect(major(read('../../node_modules/react/package.json').version)).toBeGreaterThanOrEqual(19);
});
