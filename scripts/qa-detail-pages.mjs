import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'http://localhost:4321';
const routes = [
  ['chicago', '/service-areas/chicago-heights/?qa=detail-matrix'],
  ['cosmetic', '/services/cosmetic-dentistry/?qa=detail-matrix'],
  ['complete-health-airway', '/services/complete-health-airway/?qa=detail-matrix'],
  ['emergency-comfort', '/services/emergency-comfort/?qa=detail-matrix'],
  ['implants-oral-surgery', '/services/implants-oral-surgery/?qa=detail-matrix'],
  ['orthodontic-dentistry', '/services/orthodontic-dentistry/?qa=detail-matrix'],
  ['pediatric-developmental', '/services/pediatric-developmental/?qa=detail-matrix'],
  ['periodontal-dentistry', '/services/periodontal-dentistry/?qa=detail-matrix'],
  ['preventive-diagnostic', '/services/preventive-diagnostic/?qa=detail-matrix'],
  ['recode-cognitive-health', '/services/recode-cognitive-health/?qa=detail-matrix'],
  ['restorative-reconstructive', '/services/restorative-reconstructive/?qa=detail-matrix'],
  ['wellness-offering', '/services/wellness-offering/?qa=detail-matrix'],
  ['whitening', '/services/professional-teeth-whitening/?qa=detail-matrix'],
  ['porcelain-veneers-laminates', '/services/porcelain-veneers-laminates/?qa=detail-matrix'],
  ['lumineers', '/services/lumineers/?qa=detail-matrix'],
  ['snap-on-smile', '/services/snap-on-smile/?qa=detail-matrix'],
  ['dental-bonding', '/services/dental-bonding/?qa=detail-matrix'],
  ['tooth-contouring', '/services/tooth-contouring/?qa=detail-matrix'],
  ['complete-smile-makeover', '/services/complete-smile-makeover/?qa=detail-matrix'],
  ['same-day-emergency-dental-care', '/services/same-day-emergency-dental-care/?qa=detail-matrix'],
  ['nitrous-oxide-sedation', '/services/nitrous-oxide-sedation/?qa=detail-matrix'],
  ['virtual-reality-anxiety-reduction', '/services/virtual-reality-anxiety-reduction/?qa=detail-matrix'],
  ['single-tooth-dental-implant', '/services/single-tooth-dental-implant/?qa=detail-matrix'],
  ['implant-supported-bridge', '/services/implant-supported-bridge/?qa=detail-matrix'],
  ['all-on-4-implant-solution', '/services/all-on-4-implant-solution/?qa=detail-matrix'],
  ['bone-grafting', '/services/bone-grafting/?qa=detail-matrix'],
  ['dental-implant-restoration', '/services/dental-implant-restoration/?qa=detail-matrix'],
  ['simple-tooth-extraction', '/services/simple-tooth-extraction/?qa=detail-matrix'],
  ['surgical-tooth-extraction', '/services/surgical-tooth-extraction/?qa=detail-matrix'],
  ['wisdom-tooth-removal', '/services/wisdom-tooth-removal/?qa=detail-matrix'],
  ['invisalign-clear-aligners', '/services/invisalign-clear-aligners/?qa=detail-matrix'],
  ['first-dental-visit', '/services/first-dental-visit/?qa=detail-matrix'],
  ['pediatric-cleaning-exam', '/services/pediatric-cleaning-exam/?qa=detail-matrix'],
  ['healthystart-system', '/services/healthystart-system/?qa=detail-matrix'],
  ['gum-disease-deep-cleaning', '/services/gum-disease-deep-cleaning/?qa=detail-matrix'],
  ['perio-protect', '/services/perio-protect/?qa=detail-matrix'],
  ['professional-dental-cleaning', '/services/professional-dental-cleaning/?qa=detail-matrix'],
  ['routine-comprehensive-exam', '/services/routine-comprehensive-exam/?qa=detail-matrix'],
  ['digital-dental-x-rays', '/services/digital-dental-x-rays/?qa=detail-matrix'],
  ['fluoride-treatment', '/services/fluoride-treatment/?qa=detail-matrix'],
  ['dental-sealants', '/services/dental-sealants/?qa=detail-matrix'],
  ['gum-disease-screening', '/services/gum-disease-screening/?qa=detail-matrix'],
  ['custom-sports-mouthguard', '/services/custom-sports-mouthguard/?qa=detail-matrix'],
  ['custom-night-guard', '/services/custom-night-guard/?qa=detail-matrix'],
  ['laser-dentistry', '/services/laser-dentistry/?qa=detail-matrix'],
  ['oral-spirochete-test', '/services/oral-spirochete-test/?qa=detail-matrix'],
  ['recode-2-0-dental-program', '/services/recode-2-0-dental-program/?qa=detail-matrix'],
  ['amalgam-filling-replacement', '/services/amalgam-filling-replacement/?qa=detail-matrix'],
  ['tooth-colored-dental-filling', '/services/tooth-colored-dental-filling/?qa=detail-matrix'],
  ['dental-crown', '/services/dental-crown/?qa=detail-matrix'],
  ['dental-bridge', '/services/dental-bridge/?qa=detail-matrix'],
  ['full-mouth-reconstruction', '/services/full-mouth-reconstruction/?qa=detail-matrix'],
  ['root-canal-treatment-coordination', '/services/root-canal-treatment-coordination/?qa=detail-matrix'],
  ['full-denture', '/services/full-denture/?qa=detail-matrix'],
  ['partial-denture', '/services/partial-denture/?qa=detail-matrix'],
  ['oral-cancer-screening', '/services/oral-cancer-screening/?qa=detail-matrix'],
  ['airway-sleep-screening', '/services/airway-sleep-screening/?qa=detail-matrix'],
  ['artery-health-screening', '/services/artery-health-screening/?qa=detail-matrix'],
  ['prosomnus-sleep-apnea-appliance', '/services/prosomnus-sleep-apnea-appliance/?qa=detail-matrix'],
];
const routeFilter = process.argv[2];
const activeRoutes = routeFilter ? routes.filter(([name]) => name === routeFilter) : routes;
if (!activeRoutes.length) throw new Error(`Unknown route filter: ${routeFilter}`);
const viewports = [
  ['desktop', 1440, 900],
  ['tablet', 1032, 1376],
  ['phone', 440, 956],
];
const out = 'qa-artifacts/detail-pages';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const report = [];

for (const [routeName, route] of activeRoutes) {
  for (const [viewportName, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/${routeName}-${viewportName}-top.png`, fullPage: false });

    const pageMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
      sections: [...document.querySelectorAll('main section, main footer')].map((el) => ({
        name: el.className,
        top: Math.round(el.getBoundingClientRect().top + scrollY),
        height: Math.round(el.getBoundingClientRect().height),
      })),
    }));
    if (pageMetrics.scrollWidth > pageMetrics.clientWidth + 1) errors.push(`horizontal overflow ${pageMetrics.scrollWidth - pageMetrics.clientWidth}px`);

    let index = 0;
    for (let y = 0; y <= pageMetrics.height - height; y += Math.max(360, Math.floor(height * .55))) {
      await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'auto' }), y);
      await page.waitForTimeout(240);
      const issue = await page.evaluate(() => {
        const viewport = innerHeight;
        const visible = [...document.querySelectorAll('main section, main footer')].filter((el) => {
          const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < viewport;
        });
        const content = visible.flatMap((el) => [...el.querySelectorAll('h1,h2,h3,p,img,article,details,summary,strong')]).filter((el) => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return r.width > 8 && r.height > 8 && r.bottom > 0 && r.top < viewport && style.visibility !== 'hidden' && style.opacity !== '0';
        });
        return { blank: visible.length === 0 || content.length === 0, y: Math.round(scrollY), visible: visible.map((el) => el.className) };
      });
      if (issue.blank) errors.push(`blank viewport near y=${issue.y}`);
      if (index % 4 === 0) await page.screenshot({ path: `${out}/${routeName}-${viewportName}-scroll-${String(index).padStart(2,'0')}.png`, fullPage: false });
      index++;
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${out}/${routeName}-${viewportName}-bottom.png`, fullPage: false });
    report.push({ routeName, viewportName, width, height, pageMetrics, errors });
    await page.close();
  }
}
await browser.close();
await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
for (const item of report) console.log(`${item.routeName}/${item.viewportName}: ${item.errors.length ? item.errors.join('; ') : 'PASS'}`);
if (report.some((item) => item.errors.length)) process.exitCode = 1;
