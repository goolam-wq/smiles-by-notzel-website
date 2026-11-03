import { chromium } from '@playwright/test';

const base = 'http://localhost:4321';
const routes = [
  ['cosmetic', '/services/cosmetic-dentistry/'],
  ['complete-health', '/services/complete-health-airway/'],
  ['emergency', '/services/emergency-comfort/'],
  ['implants', '/services/implants-oral-surgery/'],
  ['orthodontic', '/services/orthodontic-dentistry/'],
  ['pediatric', '/services/pediatric-developmental/'],
  ['periodontal', '/services/periodontal-dentistry/'],
  ['preventive', '/services/preventive-diagnostic/'],
];
const viewports = [
  ['desktop', 1440, 900],
  ['tablet', 1032, 1376],
  ['phone', 440, 956],
];
const references = new Map();
const failures = [];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

const rounded = (value) => Math.round(value * 10) / 10;

for (const [name, route] of routes) {
  for (const [viewportName, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
    await page.goto(`${base}${route}?qa=process-parity`, { waitUntil: 'networkidle' });

    const journey = page.locator('[data-journey]');
    if (await journey.count() !== 1) {
      failures.push(`${name}/${viewportName}: missing shared process section`);
      await page.close();
      continue;
    }

    await journey.evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(350);
    const entry = await page.evaluate(() => {
      const section = document.querySelector('[data-journey]');
      const sticky = section?.querySelector('.journey__sticky');
      const heading = section?.querySelector('h2');
      const cards = [...(section?.querySelectorAll('[data-journey-card]') || [])];
      const first = cards[0];
      const sectionRect = section?.getBoundingClientRect();
      const stickyRect = sticky?.getBoundingClientRect();
      const headingRect = heading?.getBoundingClientRect();
      const cardRect = first?.getBoundingClientRect();
      const cardStyle = first ? getComputedStyle(first) : null;
      const headingStyle = heading ? getComputedStyle(heading) : null;
      return {
        sectionTop: sectionRect?.top ?? 0,
        sectionHeight: sectionRect?.height ?? 0,
        stickyTop: stickyRect?.top ?? 0,
        stickyHeight: stickyRect?.height ?? 0,
        headingTop: headingRect?.top ?? 0,
        headingBottom: headingRect?.bottom ?? 0,
        headingRight: headingRect?.right ?? 0,
        cardTop: cardRect?.top ?? 0,
        cardBottom: cardRect?.bottom ?? 0,
        cardWidth: cardRect?.width ?? 0,
        cardHeight: cardRect?.height ?? 0,
        cardMinHeight: cardStyle?.minHeight ?? '',
        headingFontSize: headingStyle?.fontSize ?? '',
        cardCount: cards.length,
      };
    });

    const parity = {
      stickyHeight: rounded(entry.stickyHeight),
      cardWidth: rounded(entry.cardWidth),
      cardHeight: rounded(entry.cardHeight),
      cardMinHeight: entry.cardMinHeight,
      headingFontSize: entry.headingFontSize,
    };
    if (name === 'cosmetic') references.set(viewportName, parity);
    else {
      const reference = references.get(viewportName);
      for (const key of Object.keys(parity)) {
        if (typeof parity[key] === 'number') {
          if (Math.abs(parity[key] - reference[key]) > 1) failures.push(`${name}/${viewportName}: ${key} ${parity[key]} differs from Cosmetic ${reference[key]}`);
        } else if (parity[key] !== reference[key]) failures.push(`${name}/${viewportName}: ${key} ${parity[key]} differs from Cosmetic ${reference[key]}`);
      }
    }

    if (entry.cardCount !== 4) failures.push(`${name}/${viewportName}: expected 4 process cards, found ${entry.cardCount}`);
    if (entry.headingRight > width + 1) failures.push(`${name}/${viewportName}: process heading clips horizontally`);
    if (entry.cardTop < entry.headingBottom - 1) failures.push(`${name}/${viewportName}: process cards overlap heading`);
    if (entry.cardTop >= height || entry.cardBottom <= 0) failures.push(`${name}/${viewportName}: first process card is outside the entry viewport`);

    if (width > 720) {
      await page.evaluate(({ top, height: sectionHeight, viewportHeight }) => {
        window.scrollTo(0, top + Math.max(0, sectionHeight - viewportHeight) * .52);
      }, { top: entry.sectionTop + await page.evaluate(() => scrollY), height: entry.sectionHeight, viewportHeight: height });
      await page.waitForTimeout(350);
      const mid = await page.evaluate(() => {
        const heading = document.querySelector('[data-journey] h2')?.getBoundingClientRect();
        const visibleCards = [...document.querySelectorAll('[data-journey-card]')].filter((card) => {
          const rect = card.getBoundingClientRect();
          return rect.right > 0 && rect.left < innerWidth && rect.bottom > 0 && rect.top < innerHeight;
        }).length;
        return { headingTop: heading?.top ?? -1, headingBottom: heading?.bottom ?? -1, visibleCards };
      });
      if (mid.headingBottom <= 0 || mid.headingTop >= height) failures.push(`${name}/${viewportName}: heading disappears at mid-scroll`);
      if (!mid.visibleCards) failures.push(`${name}/${viewportName}: no process card visible at mid-scroll`);
    }

    if (runtimeErrors.length) failures.push(`${name}/${viewportName}: runtime errors: ${runtimeErrors.join(' | ')}`);
    console.log(`${name}/${viewportName}: checked`);
    await page.close();
  }
}

await browser.close();
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS: all service-category process sections match the Cosmetic reference across desktop, tablet and phone.');
}
