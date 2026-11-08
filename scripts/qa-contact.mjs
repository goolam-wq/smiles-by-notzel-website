import { chromium } from '@playwright/test';

const base = 'http://localhost:4321/contact/?qa=contact-matrix';
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
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

  const response = await page.goto(base, { waitUntil: 'networkidle' });
  if (!response?.ok()) errors.push(`route returned ${response?.status() ?? 'no response'}`);

  const initial = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    sections: document.querySelectorAll('main section, main aside').length,
    fields: document.querySelectorAll('[data-contact-form] input:not([type="hidden"]), [data-contact-form] select, [data-contact-form] textarea').length,
    images: [...document.images].filter((image) => image.closest('main')).length,
    navContact: document.querySelector('.desktop-nav a[href="/contact/"]')?.getAttribute('href'),
  }));
  if (initial.overflow > 1) errors.push(`horizontal overflow ${initial.overflow}px`);
  if (initial.sections < 8) errors.push(`expected enriched contact page, found ${initial.sections} sections`);
  if (initial.fields < 10) errors.push(`expected expanded form fields, found ${initial.fields}`);
  if (initial.images < 3) errors.push(`expected at least three owned page images, found ${initial.images}`);
  if (initial.navContact !== '/contact/') errors.push('navbar Contact link is not routed to /contact/');

  await page.locator('[data-contact-form] input[name="name"]').fill('QA Contact');
  await page.locator('[data-contact-form] input[name="phone"]').fill('(708) 555-0100');
  await page.locator('[data-contact-form] input[name="email"]').fill('qa@example.com');
  await page.locator('[data-contact-form] select[name="patient_status"]').selectOption({ label: 'New patient' });
  await page.locator('[data-contact-form] select[name="office"]').selectOption({ label: 'Chicago Heights' });
  await page.locator('[data-contact-form] select[name="reason"]').selectOption({ label: 'Schedule a first visit' });
  await page.locator('[data-contact-form] select[name="contact_method"]').selectOption({ label: 'Phone call' });
  await page.locator('[data-contact-form] input[name="consent"]').check();
  const valid = await page.locator('[data-contact-form]').evaluate((form) => form.checkValidity());
  if (!valid) errors.push('expanded contact form does not validate after required fields are completed');

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= scrollHeight - height; y += Math.max(360, Math.floor(height * .56))) {
    await page.evaluate((target) => window.scrollTo(0, target), y);
    await page.waitForTimeout(90);
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      visibleContent: [...document.querySelectorAll('main section, main aside, main footer')].some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight && rect.width > 20 && rect.height > 20;
      }),
    }));
    if (state.overflow > 1) errors.push(`horizontal overflow ${state.overflow}px near y=${y}`);
    if (!state.visibleContent) errors.push(`blank viewport near y=${y}`);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(450);
  const brokenImages = await page.evaluate(() => [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.getAttribute('src')));
  if (brokenImages.length) errors.push(`broken images: ${brokenImages.join(', ')}`);

  const reduced = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
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
    console.log(`${name}: PASS — form, routing, assets, overflow, scrolling and reduced motion`);
  }
  await page.close();
}

await browser.close();
if (failed) process.exitCode = 1;
