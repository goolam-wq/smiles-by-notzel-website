import { chromium } from '@playwright/test';

const base = 'http://localhost:4321/pricing/?qa=pricing-matrix';
const viewports = [
  ['desktop', 1440, 900],
  ['tablet', 1032, 1376],
  ['phone', 440, 956],
];

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

let failed = false;

for (const [name, width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

  const response = await page.goto(base, { waitUntil: 'networkidle' });
  if (!response?.ok()) errors.push(`route returned ${response?.status() ?? 'no response'}`);

  const initial = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    rowCount: document.querySelectorAll('[data-pricing-row]').length,
    sectionCount: document.querySelectorAll('main section').length,
  }));
  if (initial.overflow > 1) errors.push(`horizontal overflow ${initial.overflow}px`);
  if (initial.overflow > 1) {
    const offenders = await page.evaluate(() => [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, className: String(element.className), parent: String(element.parentElement?.className || ''), text: element.textContent?.trim().slice(0, 32), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
      })
      .filter((item) => (item.left < -1 || item.right > innerWidth + 1) && item.left < innerWidth + 100)
      .sort((a, b) => (b.right - innerWidth) - (a.right - innerWidth))
      .slice(0, 8));
    errors.push(`overflow offenders: ${JSON.stringify(offenders)}`);
  }
  if (initial.rowCount !== 48) errors.push(`expected 48 price rows, found ${initial.rowCount}`);
  if (initial.sectionCount < 10) errors.push(`expected an enriched page, found ${initial.sectionCount} sections`);

  await page.locator('[data-mode-button="monthly"]').click();
  await page.waitForTimeout(400);
  const modeAmount = (await page.locator('[data-mode-amount]').textContent())?.trim();
  if (modeAmount !== '$153') errors.push(`monthly story mode did not update (${modeAmount})`);

  await page.locator('[data-directory-mode="yearly"]').click();
  const yearlyPrice = (await page.locator('[data-pricing-row] strong').first().textContent())?.trim();
  if (!yearlyPrice) errors.push('yearly directory mode returned an empty price');

  await page.locator('[data-category-filter="cosmetic-dentistry"]').click();
  const visibleCategories = await page.locator('[data-pricing-category]:visible').count();
  if (visibleCategories !== 1) errors.push(`category filter left ${visibleCategories} groups visible`);

  await page.locator('[data-category-filter="all"]').click();
  await page.locator('[data-pricing-search]').fill('whitening');
  const visibleRows = await page.locator('[data-pricing-row]:visible').count();
  if (visibleRows !== 1) errors.push(`search expected 1 whitening result, found ${visibleRows}`);
  await page.locator('[data-pricing-search]').fill('');

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= scrollHeight - height; y += Math.max(360, Math.floor(height * 0.58))) {
    await page.evaluate((target) => window.scrollTo(0, target), y);
    await page.waitForTimeout(80);
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      visibleContent: [...document.querySelectorAll('main section, main footer')].some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight && rect.width > 20 && rect.height > 20;
      }),
    }));
    if (state.overflow > 1) errors.push(`horizontal overflow ${state.overflow}px near y=${y}`);
    if (!state.visibleContent) errors.push(`blank viewport near y=${y}`);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);
  const brokenImages = await page.evaluate(() => [...document.images]
    .filter((image) => !image.complete || image.naturalWidth === 0)
    .map((image) => image.getAttribute('src')));
  if (brokenImages.length) errors.push(`broken images: ${brokenImages.join(', ')}`);

  const reduced = await browser.newPage({
    viewport: { width, height },
    reducedMotion: 'reduce',
  });
  const reducedErrors = [];
  reduced.on('pageerror', (error) => reducedErrors.push(error.message));
  await reduced.goto(base, { waitUntil: 'networkidle' });
  const reducedOverflow = await reduced.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (reducedOverflow > 1) errors.push(`reduced-motion overflow ${reducedOverflow}px`);
  if (reducedErrors.length) errors.push(`reduced-motion runtime: ${reducedErrors.join(', ')}`);
  await reduced.close();

  if (errors.length) {
    failed = true;
    console.log(`${name}: FAIL\n  ${errors.join('\n  ')}`);
  } else {
    console.log(`${name}: PASS — 48 prices, controls, assets, overflow, scrolling and reduced motion`);
  }
  await page.close();
}

await browser.close();
if (failed) process.exitCode = 1;
