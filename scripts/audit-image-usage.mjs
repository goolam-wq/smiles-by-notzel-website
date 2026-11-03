import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const routes = [
  '/',
  '/services/',
  '/service-areas/',
  '/services/cosmetic-dentistry/',
  '/service-areas/chicago-heights/',
  '/services/professional-teeth-whitening/',
  '/services/implants-oral-surgery/',
  '/services/orthodontic-dentistry/',
];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const uses = [];

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:4321${route}`, { waitUntil: 'networkidle' });
  const routeUses = await page.evaluate(() => {
    const result = [];
    document.querySelectorAll('img').forEach((element) => {
      const src = new URL(element.src).pathname;
      if (src.includes('/images/')) result.push({
        kind: 'img',
        src,
        alt: element.alt,
        section: element.closest('section,footer,header')?.id || element.closest('section,footer,header')?.className || '',
      });
    });
    document.querySelectorAll('video[poster]').forEach((element) => {
      const src = new URL(element.poster, location.href).pathname;
      if (src.includes('/images/')) result.push({
        kind: 'poster',
        src,
        alt: element.getAttribute('aria-label') || '',
        section: element.closest('section,footer,header')?.id || element.closest('section,footer,header')?.className || '',
      });
    });
    document.querySelectorAll('source[srcset]').forEach((element) => {
      for (const candidate of element.srcset.split(',')) {
        const raw = candidate.trim().split(/\s+/)[0];
        if (!raw) continue;
        const src = new URL(raw, location.href).pathname;
        if (src.includes('/images/')) result.push({
          kind: 'srcset',
          src,
          alt: '',
          section: element.closest('section,footer,header')?.id || element.closest('section,footer,header')?.className || '',
        });
      }
    });
    document.querySelectorAll('[data-image]').forEach((element) => {
      const raw = element.getAttribute('data-image');
      if (!raw) return;
      const src = new URL(raw, location.href).pathname;
      if (src.includes('/images/')) result.push({
        kind: 'data-image',
        src,
        alt: element.getAttribute('aria-label') || '',
        section: element.closest('section,footer,header')?.id || element.closest('section,footer,header')?.className || '',
      });
    });
    document.querySelectorAll('body *').forEach((element) => {
      const background = getComputedStyle(element).backgroundImage;
      if (!background || background === 'none' || !background.includes('/images/')) return;
      for (const match of background.matchAll(/url\(["']?(.*?)["']?\)/g)) {
        try {
          const src = new URL(match[1], location.href).pathname;
          result.push({
            kind: 'background',
            src,
            alt: element.getAttribute('aria-label') || '',
            section: element.closest('section,footer,header')?.id || element.closest('section,footer,header')?.className || '',
          });
        } catch {}
      }
    });
    return result;
  });
  uses.push(...routeUses.map((entry) => ({ route, ...entry })));
  await page.close();
}

await browser.close();

const distinctUses = [...new Map(uses.map((use) => [
  `${use.route}|${use.section}|${use.src}`,
  use,
])).values()];
const bySource = Map.groupBy(distinctUses, (use) => use.src);
const collisions = [...bySource.entries()]
  .filter(([, sourceUses]) => sourceUses.length > 1)
  .map(([src, sourceUses]) => ({ src, uses: sourceUses }));

await writeFile('qa-artifacts/image-usage-audit.json', JSON.stringify({ uses, distinctUses, collisions }, null, 2));

console.log(`Rendered image instances: ${uses.length}`);
console.log(`Distinct route/section/source uses: ${distinctUses.length}`);
console.log(`Cross-route or cross-section collisions: ${collisions.length}`);
for (const collision of collisions) {
  console.log(`\n${collision.src}`);
  for (const use of collision.uses) console.log(`  ${use.route} :: ${use.section || '(unscoped)'} :: ${use.kind}`);
}

if (collisions.length) process.exitCode = 1;
