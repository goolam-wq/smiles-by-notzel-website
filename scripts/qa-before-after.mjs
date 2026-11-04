import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'http://localhost:4321';
const routes = [
  ['home', '/', '#before-after-home'],
  ['services', '/services/', '#before-after-services'],
  ['service-areas', '/service-areas/', '#before-after-service-areas'],
  ['cosmetic', '/services/cosmetic-dentistry/', '#before-after-cosmetic'],
  ['complete-health-airway', '/services/complete-health-airway/', '#before-after-complete-health-airway'],
  ['emergency-comfort', '/services/emergency-comfort/', '#before-after-emergency-comfort'],
  ['implants-oral-surgery', '/services/implants-oral-surgery/', '#before-after-implants-oral-surgery'],
  ['orthodontic-dentistry', '/services/orthodontic-dentistry/', '#before-after-orthodontic-dentistry'],
  ['pediatric-developmental', '/services/pediatric-developmental/', '#before-after-pediatric-developmental'],
  ['periodontal-dentistry', '/services/periodontal-dentistry/', '#before-after-periodontal-dentistry'],
  ['preventive-diagnostic', '/services/preventive-diagnostic/', '#before-after-preventive-diagnostic'],
  ['recode-cognitive-health', '/services/recode-cognitive-health/', '#before-after-recode-cognitive-health'],
  ['restorative-reconstructive', '/services/restorative-reconstructive/', '#before-after-restorative-reconstructive'],
  ['wellness-offering', '/services/wellness-offering/', '#before-after-wellness-offering'],
  ['chicago-heights', '/service-areas/chicago-heights/', '#before-after-chicago-heights'],
  ['whitening', '/services/professional-teeth-whitening/', '#before-after-professional-whitening'],
  ['porcelain-veneers-laminates', '/services/porcelain-veneers-laminates/', '#before-after-porcelain-veneers-laminates'],
  ['lumineers', '/services/lumineers/', '#before-after-lumineers'],
  ['snap-on-smile', '/services/snap-on-smile/', '#before-after-snap-on-smile'],
  ['dental-bonding', '/services/dental-bonding/', '#before-after-dental-bonding'],
  ['tooth-contouring', '/services/tooth-contouring/', '#before-after-tooth-contouring'],
  ['complete-smile-makeover', '/services/complete-smile-makeover/', '#before-after-complete-smile-makeover'],
  ['same-day-emergency-dental-care', '/services/same-day-emergency-dental-care/', '#before-after-same-day-emergency-dental-care'],
  ['nitrous-oxide-sedation', '/services/nitrous-oxide-sedation/', '#before-after-nitrous-oxide-sedation'],
  ['virtual-reality-anxiety-reduction', '/services/virtual-reality-anxiety-reduction/', '#before-after-virtual-reality-anxiety-reduction'],
  ['single-tooth-dental-implant', '/services/single-tooth-dental-implant/', '#before-after-single-tooth-dental-implant'],
  ['implant-supported-bridge', '/services/implant-supported-bridge/', '#before-after-implant-supported-bridge'],
  ['all-on-4-implant-solution', '/services/all-on-4-implant-solution/', '#before-after-all-on-4-implant-solution'],
  ['bone-grafting', '/services/bone-grafting/', '#before-after-bone-grafting'],
  ['dental-implant-restoration', '/services/dental-implant-restoration/', '#before-after-dental-implant-restoration'],
  ['simple-tooth-extraction', '/services/simple-tooth-extraction/', '#before-after-simple-tooth-extraction'],
  ['surgical-tooth-extraction', '/services/surgical-tooth-extraction/', '#before-after-surgical-tooth-extraction'],
  ['wisdom-tooth-removal', '/services/wisdom-tooth-removal/', '#before-after-wisdom-tooth-removal'],
  ['invisalign-clear-aligners', '/services/invisalign-clear-aligners/', '#before-after-invisalign-clear-aligners'],
  ['first-dental-visit', '/services/first-dental-visit/', '#before-after-first-dental-visit'],
  ['pediatric-cleaning-exam', '/services/pediatric-cleaning-exam/', '#before-after-pediatric-cleaning-exam'],
  ['healthystart-system', '/services/healthystart-system/', '#before-after-healthystart-system'],
  ['gum-disease-deep-cleaning', '/services/gum-disease-deep-cleaning/', '#before-after-gum-disease-deep-cleaning'],
  ['perio-protect', '/services/perio-protect/', '#before-after-perio-protect'],
  ['professional-dental-cleaning', '/services/professional-dental-cleaning/', '#before-after-professional-dental-cleaning'],
  ['routine-comprehensive-exam', '/services/routine-comprehensive-exam/', '#before-after-routine-comprehensive-exam'],
  ['digital-dental-x-rays', '/services/digital-dental-x-rays/', '#before-after-digital-dental-x-rays'],
  ['fluoride-treatment', '/services/fluoride-treatment/', '#before-after-fluoride-treatment'],
  ['dental-sealants', '/services/dental-sealants/', '#before-after-dental-sealants'],
  ['gum-disease-screening', '/services/gum-disease-screening/', '#before-after-gum-disease-screening'],
  ['custom-sports-mouthguard', '/services/custom-sports-mouthguard/', '#before-after-custom-sports-mouthguard'],
  ['custom-night-guard', '/services/custom-night-guard/', '#before-after-custom-night-guard'],
  ['laser-dentistry', '/services/laser-dentistry/', '#before-after-laser-dentistry'],
  ['oral-spirochete-test', '/services/oral-spirochete-test/', '#before-after-oral-spirochete-test'],
  ['recode-2-0-dental-program', '/services/recode-2-0-dental-program/', '#before-after-recode-2-0-dental-program'],
  ['amalgam-filling-replacement', '/services/amalgam-filling-replacement/', '#before-after-amalgam-filling-replacement'],
  ['tooth-colored-dental-filling', '/services/tooth-colored-dental-filling/', '#before-after-tooth-colored-dental-filling'],
  ['dental-crown', '/services/dental-crown/', '#before-after-dental-crown'],
  ['dental-bridge', '/services/dental-bridge/', '#before-after-dental-bridge'],
  ['full-mouth-reconstruction', '/services/full-mouth-reconstruction/', '#before-after-full-mouth-reconstruction'],
  ['root-canal-treatment-coordination', '/services/root-canal-treatment-coordination/', '#before-after-root-canal-treatment-coordination'],
  ['full-denture', '/services/full-denture/', '#before-after-full-denture'],
  ['partial-denture', '/services/partial-denture/', '#before-after-partial-denture'],
  ['oral-cancer-screening', '/services/oral-cancer-screening/', '#before-after-oral-cancer-screening'],
  ['airway-sleep-screening', '/services/airway-sleep-screening/', '#before-after-airway-sleep-screening'],
  ['artery-health-screening', '/services/artery-health-screening/', '#before-after-artery-health-screening'],
  ['prosomnus-sleep-apnea-appliance', '/services/prosomnus-sleep-apnea-appliance/', '#before-after-prosomnus-sleep-apnea-appliance'],
  ['juice-plus-wellness-program', '/services/juice-plus-wellness-program/', '#before-after-juice-plus-wellness-program'],
];
const requestedRoute = process.argv[2];
const selectedRoutes = requestedRoute
  ? routes.filter(([routeName]) => routeName === requestedRoute)
  : routes;
if (requestedRoute && selectedRoutes.length === 0) {
  throw new Error(`Unknown before/after QA route: ${requestedRoute}`);
}
const viewports = [
  ['desktop', 1440, 900],
  ['tablet', 1032, 1376],
  ['phone', 440, 956],
];
const out = 'qa-artifacts/before-after';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = [];

for (const [routeName, route, selector] of selectedRoutes) {
  for (const [viewportName, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    await page.goto(`${base}${route}?qa=before-after-matrix`, { waitUntil: 'domcontentloaded' });
    const section = page.locator(selector);
    if (await section.count() !== 1) errors.push(`section count ${await section.count()}`);
    else {
      await section.scrollIntoViewIfNeeded();
      const media = section.locator('.before-after__image img').first();
      await media.waitFor({ state: 'visible' });
      await media.evaluate((image) => image.complete || new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }));
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/${routeName}-${viewportName}-section.png`, fullPage: false });
      const sectionBox = await section.boundingBox();
      if (!sectionBox || sectionBox.height < Math.min(520, height * .65)) errors.push(`undersized section ${sectionBox?.height ?? 0}px`);
      const range = section.locator('[data-before-after-range]');
      await range.evaluate((el) => { el.value = '22'; el.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.waitForTimeout(80);
      const splitLow = await section.evaluate((el) => getComputedStyle(el).getPropertyValue('--split').trim());
      await range.evaluate((el) => { el.value = '78'; el.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.waitForTimeout(80);
      const splitHigh = await section.evaluate((el) => getComputedStyle(el).getPropertyValue('--split').trim());
      if (!splitLow.startsWith('22') || !splitHigh.startsWith('78')) errors.push(`slider failed ${splitLow} -> ${splitHigh}`);
      await page.screenshot({ path: `${out}/${routeName}-${viewportName}-after.png`, fullPage: false });
      const geometry = await section.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const visual = el.querySelector('.before-after__visual')?.getBoundingClientRect();
        const details = el.querySelector('.before-after__details')?.getBoundingClientRect();
        const media = el.querySelector('.before-after__image img');
        const mediaStyle = media ? getComputedStyle(media) : null;
        return {
          section: { left: r.left, right: r.right, height: r.height },
          visual: visual && { left: visual.left, right: visual.right, top: visual.top, bottom: visual.bottom },
          details: details && { left: details.left, right: details.right, top: details.top, bottom: details.bottom },
          media: media && {
            naturalWidth: media.naturalWidth,
            naturalHeight: media.naturalHeight,
            objectFit: mediaStyle?.objectFit,
          },
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      });
      if (geometry.scrollWidth > geometry.clientWidth + 1) errors.push(`horizontal overflow ${geometry.scrollWidth - geometry.clientWidth}px`);
      for (const key of ['visual', 'details']) {
        const box = geometry[key];
        if (!box || box.right < 0 || box.left > width || box.bottom < 0 || box.top > height) errors.push(`${key} outside viewport`);
      }
      if (!geometry.media?.naturalWidth || !geometry.media?.naturalHeight) errors.push('comparison image failed to load');
      if (geometry.media?.objectFit !== 'cover') errors.push(`comparison image can distort: object-fit ${geometry.media?.objectFit ?? 'missing'}`);
      const sectionTop = await section.evaluate((el) => el.getBoundingClientRect().top + scrollY);
      for (const [state, y] of [['entry', sectionTop - height * .72], ['middle', sectionTop + Math.max(0, sectionBox.height * .45 - height * .5)], ['exit', sectionTop + sectionBox.height - height * .3]]) {
        await page.evaluate((target) => scrollTo(0, target), y);
        await page.waitForTimeout(120);
        const blank = await page.evaluate(() => {
          const visible = [...document.querySelectorAll('main section,main footer')].filter((el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
          const content = visible.flatMap((el) => [...el.querySelectorAll('h1,h2,h3,p,img,article,figure,strong')]).filter((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 8 && r.height > 8 && r.bottom > 0 && r.top < innerHeight && s.visibility !== 'hidden' && Number(s.opacity) > .02; });
          return content.length === 0;
        });
        if (blank) errors.push(`blank viewport at ${state}`);
      }
      report.push({ routeName, viewportName, width, height, splitLow, splitHigh, geometry, errors });
    }
    await page.close();
  }
}

await browser.close();
await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
for (const item of report) console.log(`${item.routeName}/${item.viewportName}: ${item.errors.length ? item.errors.join('; ') : 'PASS'}`);
if (report.some((item) => item.errors.length)) process.exitCode = 1;
