import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const routes = [
  '/',
  '/contact/',
  '/pricing/',
  '/team/',
  '/services/',
  '/service-areas/',
  '/services/cosmetic-dentistry/',
  '/service-areas/chicago-heights/',
  '/service-areas/mokena/',
  '/service-areas/south-chicago-heights/',
  '/service-areas/steger/',
  '/service-areas/sauk-village/',
  '/service-areas/lynwood/',
  '/service-areas/glenwood/',
  '/service-areas/ford-heights/',
  '/service-areas/olympia-fields/',
  '/service-areas/park-forest/',
  '/service-areas/homewood/',
  '/service-areas/flossmoor/',
  '/service-areas/hazel-crest/',
  '/service-areas/matteson/',
  '/service-areas/crete/',
  '/service-areas/country-club-hills/',
  '/service-areas/richton-park/',
  '/service-areas/frankfort/',
  '/service-areas/new-lenox/',
  '/service-areas/tinley-park/',
  '/service-areas/orland-park/',
  '/service-areas/homer-glen/',
  '/service-areas/lockport/',
  '/service-areas/manhattan/',
  '/service-areas/frankfort-square/',
  '/service-areas/orland-hills/',
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
  '/services/wisdom-tooth-removal/',
  '/services/invisalign-clear-aligners/',
  '/services/first-dental-visit/',
  '/services/pediatric-cleaning-exam/',
  '/services/healthystart-system/',
  '/services/gum-disease-deep-cleaning/',
  '/services/perio-protect/',
  '/services/professional-dental-cleaning/',
  '/services/routine-comprehensive-exam/',
  '/services/digital-dental-x-rays/',
  '/services/fluoride-treatment/',
  '/services/dental-sealants/',
  '/services/gum-disease-screening/',
  '/services/custom-sports-mouthguard/',
  '/services/custom-night-guard/',
  '/services/laser-dentistry/',
  '/services/oral-spirochete-test/',
  '/services/recode-2-0-dental-program/',
  '/services/amalgam-filling-replacement/',
  '/services/tooth-colored-dental-filling/',
  '/services/dental-crown/',
  '/services/dental-bridge/',
  '/services/full-mouth-reconstruction/',
  '/services/root-canal-treatment-coordination/',
  '/services/full-denture/',
  '/services/partial-denture/',
  '/services/oral-cancer-screening/',
  '/services/airway-sleep-screening/',
  '/services/artery-health-screening/',
  '/services/prosomnus-sleep-apnea-appliance/',
  '/services/juice-plus-wellness-program/',
  '/services/restorative-reconstructive/',
  '/services/wellness-offering/',
];

const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1032, height: 1376 },
  phone: { width: 440, height: 956 },
};

const requestedRoutes = process.argv.slice(2);
const activeRoutes = requestedRoutes.length
  ? routes.filter((route) => requestedRoutes.includes(route))
  : routes;

if (requestedRoutes.length && activeRoutes.length !== requestedRoutes.length) {
  const unknownRoutes = requestedRoutes.filter((route) => !routes.includes(route));
  throw new Error(`Unknown unique-image QA route(s): ${unknownRoutes.join(', ')}`);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

const results = [];

for (const [viewportName, viewport] of Object.entries(viewports)) {
  for (const route of activeRoutes) {
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

    // The full-page scroll initiates native lazy-loaded images, but larger WebP
    // assets can still be in flight when the final scroll step completes. Wait
    // for every initiated image to settle before classifying it as broken so a
    // slow local decode/network response cannot produce a false QA failure.
    await page.evaluate(async () => {
      const pendingImages = [...document.images].filter((image) => !image.complete);
      await Promise.race([
        Promise.all(
          pendingImages.map(
            (image) =>
              new Promise((resolve) => {
                image.addEventListener('load', resolve, { once: true });
                image.addEventListener('error', resolve, { once: true });
              }),
          ),
        ),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    });

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
