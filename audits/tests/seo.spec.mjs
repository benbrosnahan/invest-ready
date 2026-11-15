// SEO and findability: what a search engine or an AI assistant sees in the raw HTML, and the share card.
import { test, expect } from './helpers.mjs';

const meta = (html, attr, key) => html.match(new RegExp(`<meta[^>]+${attr}="${key}"[^>]+content="([^"]*)"`))?.[1];

test('UX-04 and SEO-01 the home page has a plain title, an honest description, canonical and share tags', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  expect(title).toContain('Invest Ready by Cense');
  expect(title).not.toMatch(/[—–~]/);
  const description = meta(html, 'name', 'description') ?? '';
  expect(description.length).toBeGreaterThan(50);
  expect(description).not.toMatch(/how much to put in/);
  expect(html).toMatch(/<link rel="canonical" href="https:\/\/invest-ready\.vercel\.app\/?"/);
  expect(meta(html, 'property', 'og:title')).toBeTruthy();
  expect(meta(html, 'property', 'og:url')).toMatch(/^https:\/\/invest-ready\.vercel\.app/);
  expect(meta(html, 'property', 'og:image')).toMatch(/opengraph-image/);
});

test('SEO-01 the server HTML already holds the page heading and the first question', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toMatch(/<h1[^>]*>Are you ready to start investing\?<\/h1>/);
  expect(html).toContain('Do you have a regular source of income right now?');
  expect(html).toMatch(/<main/);
});

test('SEO-01 structured data describes a free web application', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const block = html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)?.[1];
  const data = JSON.parse(block);
  expect(data['@type']).toBe('WebApplication');
  expect(data.offers.price).toBe('0');
});

test('SEO-01 robots.txt and the sitemap exist, and robots keeps /results out', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const body = await robots.text();
  expect(body).toMatch(/Disallow: \/results/);
  expect(body).toMatch(/Sitemap: https:\/\/invest-ready\.vercel\.app\/sitemap\.xml/);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<loc>https://invest-ready.vercel.app/</loc>');
});

test('SEO-02 /results is marked noindex', async ({ request }) => {
  const html = await (await request.get('/results')).text();
  expect(meta(html, 'name', 'robots')).toMatch(/noindex/);
});

test('the share image and icon are served', async ({ request }) => {
  const og = await request.get('/opengraph-image');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toBe('image/png');
  expect((await request.get('/icon.svg')).status()).toBe(200);
});
