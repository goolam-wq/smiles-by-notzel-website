import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const routes = [
  '/',
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
  '/services/implants-oral-surgery/',
  '/services/orthodontic-dentistry/',
  '/services/pediatric-developmental/',
  '/services/periodontal-dentistry/',
  '/services/preventive-diagnostic/',
  '/services/recode-cognitive-health/',
  '/services/restorative-reconstructive/',
  '/services/wellness-offering/',
];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const uses = [];

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Some pages intentionally keep media requests alive, so networkidle can
  // time out even when the document and every inspectable image source are
  // ready. The audit reads declared sources, making DOM readiness sufficient.
  await page.goto(`http://localhost:4321${route}`, { waitUntil: 'domcontentloaded' });
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
