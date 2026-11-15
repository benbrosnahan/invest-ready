// Accessibility: axe-core on every kind of screen, at phone and desktop sizes, plus the checks axe cannot make.
import { AxeBuilder } from '@axe-core/playwright';
import { test, expect, A, ROTH, CONSERVATIVE, answers, resultFor, PHONE, DESKTOP } from './helpers.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const SCREENS = {
  'quiz, first question': async page => page.goto('/'),
  'quiz, debt question': async page => answers(page, A.steady),
  'not yet, cushion': async page => resultFor(page, A.steady, A.noDebt, A.noCushion),
  'not yet, debt': async page => resultFor(page, A.steady, A.highDebt),
  'save it for now': async page => resultFor(page, A.steady, A.noDebt, A.month, A.soon),
  'Roth plan, guide and a fund open': async page => {
    await resultFor(page, ...ROTH);
    await page.getByRole('button', { name: /How to open your account/ }).click();
    await page.getByRole('button', { name: 'What is VTI?' }).click();
  },
  'conservative brokerage plan': async page => resultFor(page, ...CONSERVATIVE),
};

for (const [size, viewport] of Object.entries({ phone: PHONE, desktop: DESKTOP })) {
  for (const [name, enter] of Object.entries(SCREENS)) {
    test(`A11Y-01 to A11Y-06 axe finds nothing: ${name}, ${size}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await enter(page);
      // Let entrance animations finish so contrast is measured on final colours.
      await page.waitForTimeout(1200);
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}

test('A11Y-04 nothing is set below the 13px type floor, and controls are at least 40px tall', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await resultFor(page, ...ROTH);
  await page.getByRole('button', { name: /How to open your account/ }).click();
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main *, header *')]
      .filter(el => el.checkVisibility?.() && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
      .filter(el => parseFloat(getComputedStyle(el).fontSize) < 13)
      .map(el => `${el.tagName} "${el.textContent.trim().slice(0, 30)}" ${getComputedStyle(el).fontSize}`)
  );
  expect(small).toEqual([]);
  const short = await page.evaluate(() =>
    [...document.querySelectorAll('main button, main a, main input')]
      .filter(el => el.checkVisibility?.())
      .filter(el => el.getBoundingClientRect().height < 40)
      .map(el => `${el.tagName} "${(el.textContent || el.id).trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`)
  );
  expect(short).toEqual([]);
});

test('A11Y-07 motion is switched off when the system asks for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await resultFor(page, ...ROTH);
  const longest = await page.evaluate(() =>
    Math.max(0, ...document.getAnimations().map(a => Number(a.effect?.getComputedTiming().endTime) || 0))
  );
  expect(longest).toBeLessThan(50);
});

test('after answering, keyboard focus moves to the next question', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // the Cense link
  await page.keyboard.press('Tab'); // the first answer
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await expect(page.locator(':focus')).toHaveText('Do you owe anything above 8% interest?');
});

test('A11Y-08 each fund control is named for its fund', async ({ page }) => {
  await resultFor(page, ...ROTH);
  for (const t of ['VTI', 'FSKAX', 'VT']) await expect(page.getByRole('button', { name: `What is ${t}?` })).toBeVisible();
});
