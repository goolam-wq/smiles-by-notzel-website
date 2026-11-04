import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const routes = [
  '/',
  '/services/',
  '/service-areas/',
  '/services/cosmetic-dentistry/',
  '/service-areas/chicago-heights/',
  '/services/professional-teeth-whitening/',
  '/services/porcelain-veneers-laminates/',
  '/services/lumineers/',
  '/services/snap-on-smile/',
  '/services/dental-bonding/',
  '/services/tooth-contouring/',
  '/services/complete-smile-makeover/',
  '/services/same-day-emergency-dental-care/',
  '/services/nitrous-oxide-sedation/',
  '/services/virtual-reality-anxiety-reduction/',
  '/services/single-tooth-dental-implant/',
  '/services/implant-supported-bridge/',
  '/services/all-on-4-implant-solution/',
  '/services/bone-grafting/',
  '/services/dental-implant-restoration/',
  '/services/simple-tooth-extraction/',
  '/services/surgical-tooth-extraction/',
  '/services/restorative-reconstructive/',
  '/services/wellness-offering/',
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1032, height: 1376 },
  phone: { width: 440, height: 956 },
};

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

const results = [];

for (const [viewportName, viewport] of Object.entries(viewports)) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(`http://localhost:4321${route}?qa=unique-image-${viewportName}`, {
      waitUntil: 'networkidle',
    });

    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= pageHeight; y += Math.max(480, Math.floor(viewport.height * 0.72))) {
      await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
      await page.waitForTimeout(45);
    }

    const metrics = await page.evaluate(() => {
      const brokenImages = [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => ({ src: image.currentSrc || image.src, alt: image.alt }));
      const missingUniqueAssets = [...document.querySelectorAll('img,video,[data-image]')]
        .map((element) => element.currentSrc || element.poster || element.getAttribute('data-image') || '')
        .filter((src) => src.includes('/generated/unique/') && !src.endsWith('.webp'));
      return {
        brokenImages,
        missingUniqueAssets,
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
      };
    });

    const passed =
      metrics.brokenImages.length === 0 &&
      metrics.missingUniqueAssets.length === 0 &&
      metrics.documentWidth <= metrics.viewportWidth + 2 &&
      pageErrors.length === 0;

    results.push({ route, viewportName, passed, pageErrors, ...metrics });
    console.log(`${passed ? 'PASS' : 'FAIL'} ${viewportName.padEnd(7)} ${route}`);
    await page.close();
  }
}

await browser.close();
await mkdir('qa-artifacts', { recursive: true });
await writeFile('qa-artifacts/unique-image-responsive-qa.json', JSON.stringify(results, null, 2));

const failures = results.filter((result) => !result.passed);
console.log(`\n${results.length - failures.length}/${results.length} responsive route checks passed.`);
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
