// Screenshots for the redesign loop: the quiz and each kind of result, at phone and desktop sizes.
// Usage: node screenshots.mjs <base url> <out dir> [prefix]
// Drives the quiz with real clicks on the option labels, so it works on the live site and on a local build.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const [base = 'http://localhost:3201/', out = 'screenshots/after', prefix = ''] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const SIZES = { phone: { width: 375, height: 812 }, desktop: { width: 1440, height: 900 } };

// Each answer is matched by the start of its label, which both the old and the new copy share.
const pick = async (page, re) => {
  await page.getByRole('button', { name: re }).or(page.getByRole('radio', { name: re })).first().click();
  await page.waitForTimeout(650);
};

const STATES = {
  'quiz-step1': async () => {},
  'quiz-step3': async page => {
    await pick(page, /^Yes, it.s consistent/);
    await pick(page, /^Yes, I have at least one month/);
  },
  'result-gate': async page => {
    await pick(page, /^Yes, it.s consistent/);
    await pick(page, /^No savings cushion yet/);
  },
  'result-plan': async page => {
    await pick(page, /^Yes, it.s consistent/);
    await pick(page, /^Yes, I have at least one month/);
    await pick(page, /^Only (low-interest debt|debt under 8%)/);
    await pick(page, /^Retirement/);
    await pick(page, /^Leave it and wait/);
  },
  'result-savings': async page => {
    await pick(page, /^Yes, it.s consistent/);
    await pick(page, /^Yes, I have at least one month/);
    await pick(page, /^No debt/);
    await pick(page, /^Might need it within/);
  },
};

const browser = await chromium.launch();
for (const [size, viewport] of Object.entries(SIZES)) {
  for (const [name, enter] of Object.entries(STATES)) {
    const page = await browser.newPage({ viewport });
    await page.goto(base, { waitUntil: 'networkidle' });
    await enter(page);
    await page.waitForTimeout(900);
    const file = path.join(out, `${prefix}${name}-${size}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await page.close();
  }
}
await browser.close();
