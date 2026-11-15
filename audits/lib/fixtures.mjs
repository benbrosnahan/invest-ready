// Shared fixtures for Invest Ready: the answers that reach each kind of result, the sessionStorage the results
// page reads, and helpers that drive the quiz with real clicks. Adapted from the Loan Desk audit kit.

/** sessionStorage keys. The live site before this audit stored the computed result; the audited build stores answers. */
export const KEYS = {
  result: 'invest-ready-result',
  answers: 'invest-ready-answers',
};

/** A student who reaches the yes path: steady pay, a month saved, a federal loan, retirement, moderate risk. */
export const PLAN_ANSWERS = { income: 'consistent', emergency: 'funded', debt: 'low_interest', goal: 'retirement', risk: 'moderate' };

// What the pre-audit build stored for PLAN_ANSWERS, so the seeded results page renders on the live baseline too.
const LEGACY_PLAN_RESULT = {
  type: 'plan',
  accountType: 'roth_ira',
  accountLabel: 'Roth IRA',
  accountReason: 'A Roth IRA is ideal for retirement savings when you are young.',
  funds: [
    { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', description: 'US stocks.', fee: '0.03%/yr', role: 'primary', provider: 'Vanguard' },
    { ticker: 'FSKAX', name: 'Fidelity Total Market Index Fund', description: 'US stocks.', fee: '0.015%/yr', role: 'primary', provider: 'Fidelity' },
    { ticker: 'VT', name: 'Vanguard Total World Stock ETF', description: 'World stocks.', fee: '0.07%/yr', role: 'primary', provider: 'Vanguard' },
  ],
  allocationLabel: 'Something like 100% VTI or 100% VT to keep it simple.',
  openLinks: [{ label: 'Open at Fidelity', url: 'https://www.fidelity.com/retirement-ira/roth-ira' }],
};

/** Script for evaluateOnNewDocument: seeds sessionStorage before any app code runs, in the formats of both builds. */
export function seedScript({ answers = PLAN_ANSWERS } = {}) {
  return `(() => { try {
    sessionStorage.setItem(${JSON.stringify(KEYS.answers)}, ${JSON.stringify(JSON.stringify(answers))});
    sessionStorage.setItem(${JSON.stringify(KEYS.result)}, ${JSON.stringify(JSON.stringify(LEGACY_PLAN_RESULT))});
  } catch {} })();`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Click a control by its visible text with a real (trusted) mouse click. An answer card's text starts with its
 * label and goes on with its description, so a label prefix is enough.
 */
export async function clickText(page, text) {
  const handle = await page.evaluateHandle(t => {
    const norm = s => (s || '').replace(/\s+/g, ' ').replace(/[‘’]/g, "'").trim();
    const els = [...document.querySelectorAll('button, a, [role="radio"]')];
    return els.find(e => norm(e.innerText) === t && e.offsetParent !== null)
      || els.find(e => norm(e.innerText).startsWith(t) && e.offsetParent !== null)
      || null;
  }, text);
  const el = handle.asElement();
  if (!el) throw new Error(`clickText: no visible control "${text}"`);
  await el.click();
  await sleep(650);
}

/** The labels that reach each result. Each is a prefix both the pre-audit copy and the audited copy start with. */
export const ANSWER_LABELS = {
  consistent: "Yes, it's consistent",
  funded: 'Yes, I have at least one month',
  noCushion: 'No savings cushion yet',
  lowDebt: 'Only ',
  noDebt: 'No debt',
  retirement: 'Retirement',
  soon: 'Might need it within',
  moderate: 'Leave it and wait',
};

export async function answer(page, ...keys) {
  for (const key of keys) await clickText(page, ANSWER_LABELS[key]);
}

/**
 * The audited states: the quiz's first and middle question and the three kinds of result. `enter` drives the quiz
 * with real clicks from a fresh first visit; nothing is seeded.
 */
export const STATES = {
  quiz: { seeded: false, enter: async () => {} },
  'quiz-debt': { seeded: false, enter: async page => answer(page, 'consistent') },
  'result-gate': { seeded: false, enter: async page => { await answer(page, 'consistent', 'noDebt', 'noCushion'); await sleep(800); } },
  'result-plan': { seeded: false, enter: async page => { await answer(page, 'consistent', 'lowDebt', 'funded', 'retirement', 'moderate'); await sleep(800); } },
  'result-savings': { seeded: false, enter: async page => { await answer(page, 'consistent', 'noDebt', 'funded', 'soon'); await sleep(800); } },
};
