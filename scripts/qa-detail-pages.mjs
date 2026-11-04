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
