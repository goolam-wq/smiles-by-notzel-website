import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const root = resolve(process.cwd(), 'dist');

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
};

const routeFromFile = (file) => {
  const local = relative(root, file).split(sep).join('/');
  if (local === 'index.html') return '/';
  return `/${local.replace(/\/index\.html$/, '')}/`;
};

const normalizeRoute = (pathname) => {
  let route = pathname.replace(/\/index\.html$/, '/');
  if (!route.startsWith('/')) route = `/${route}`;
  if (!route.endsWith('/') && !route.split('/').at(-1)?.includes('.')) route += '/';
  return route.replace(/\/+/g, '/');
};

const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html') && relative(root, file).split(sep).join('/') !== '__qa-responsive.html');
const pages = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]));
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1].replaceAll('&amp;', '&'));
  pages.set(routeFromFile(file), { file, html, ids, hrefs });
}

const routes = new Set(pages.keys());
const graph = new Map([...routes].map((route) => [route, new Set()]));
const inbound = new Map([...routes].map((route) => [route, new Set()]));
const brokenRoutes = [];
const brokenFragments = [];
let internalLinkCount = 0;

const hasStaticFile = async (pathname) => {
  try {
    return (await stat(join(root, pathname.replace(/^\//, '')))).isFile();
  } catch {
    return false;
  }
};

for (const [source, page] of pages) {
  for (const rawHref of page.hrefs) {
    if (!rawHref || /^(?:https?:|mailto:|tel:|sms:|data:|blob:|javascript:)/i.test(rawHref)) continue;
    const targetUrl = new URL(rawHref, `https://local.test${source}`);
    if (targetUrl.origin !== 'https://local.test') continue;

    const targetRoute = normalizeRoute(targetUrl.pathname);
    const targetPage = pages.get(targetRoute);
    internalLinkCount += 1;

    if (!targetPage) {
      if (!await hasStaticFile(targetUrl.pathname)) brokenRoutes.push({ source, href: rawHref, target: targetRoute });
      continue;
    }

    graph.get(source)?.add(targetRoute);
    if (source !== targetRoute) inbound.get(targetRoute)?.add(source);

    if (targetUrl.hash) {
      const fragment = decodeURIComponent(targetUrl.hash.slice(1));
      if (fragment && !targetPage.ids.has(fragment)) brokenFragments.push({ source, href: rawHref, target: targetRoute, fragment });
    }
  }
}

const reachable = new Set(['/']);
const queue = ['/'];
while (queue.length) {
  const route = queue.shift();
  for (const target of graph.get(route) ?? []) {
    if (reachable.has(target)) continue;
    reachable.add(target);
    queue.push(target);
  }
}

const orphanRoutes = [...routes].filter((route) => route !== '/' && !reachable.has(route)).sort();
const zeroInbound = [...routes].filter((route) => route !== '/' && !(inbound.get(route)?.size)).sort();
const deadEnds = [...routes].filter((route) => !(graph.get(route)?.size)).sort();
const connectivityFailures = [];
const primaryDestinations = [
  '/services/',
  '/service-areas/',
  '/pricing/',
  '/about/',
  '/contact/',
  '/blog/',
  '/team/',
  '/faq/',
];

const hasTarget = (source, predicate) => [...(graph.get(source) ?? [])].some(predicate);
for (const route of routes) {
  for (const destination of primaryDestinations) {
    if (!graph.get(route)?.has(destination)) connectivityFailures.push(`${route} has no direct navigation link to ${destination}`);
  }
  if (/^\/services\/[^/]+\/$/.test(route)) {
    if (!graph.get(route)?.has('/services/')) connectivityFailures.push(`${route} does not link back to /services/`);
    if (!hasTarget(route, (target) => /^\/services\/[^/]+\/$/.test(target) && target !== route)) connectivityFailures.push(`${route} has no related service link`);
    if (!hasTarget(route, (target) => /^\/service-areas\/[^/]+\/$/.test(target))) connectivityFailures.push(`${route} has no service-area detail link`);
  }
  if (/^\/service-areas\/[^/]+\/$/.test(route)) {
    if (!graph.get(route)?.has('/service-areas/')) connectivityFailures.push(`${route} does not link back to /service-areas/`);
    if (!hasTarget(route, (target) => /^\/service-areas\/[^/]+\/$/.test(target) && target !== route)) connectivityFailures.push(`${route} has no related service-area link`);
    if (!hasTarget(route, (target) => /^\/services\/[^/]+\/$/.test(target))) connectivityFailures.push(`${route} has no service detail link`);
  }
  if (/^\/blog\/[^/]+\/$/.test(route)) {
    if (!graph.get(route)?.has('/blog/')) connectivityFailures.push(`${route} does not link back to /blog/`);
    if (!hasTarget(route, (target) => /^\/blog\/[^/]+\/$/.test(target) && target !== route)) connectivityFailures.push(`${route} has no related article link`);
  }
}

const requireHubCoverage = (hub, pattern, label) => {
  for (const detailRoute of [...routes].filter((route) => pattern.test(route))) {
    if (!graph.get(hub)?.has(detailRoute)) connectivityFailures.push(`${hub} does not link to existing ${label} ${detailRoute}`);
  }
};

requireHubCoverage('/services/', /^\/services\/[^/]+\/$/, 'service page');
requireHubCoverage('/service-areas/', /^\/service-areas\/[^/]+\/$/, 'service-area page');
requireHubCoverage('/blog/', /^\/blog\/[^/]+\/$/, 'article');
const lowInbound = [...routes]
  .filter((route) => route !== '/')
  .map((route) => ({ route, inboundPages: inbound.get(route)?.size ?? 0 }))
  .sort((a, b) => a.inboundPages - b.inboundPages || a.route.localeCompare(b.route))
  .slice(0, 20);

console.log(`Generated pages: ${routes.size}`);
console.log(`Internal links: ${internalLinkCount}`);
console.log(`Reachable from home: ${reachable.size}/${routes.size}`);
console.log(`Broken internal routes: ${brokenRoutes.length}`);
console.log(`Broken hash targets: ${brokenFragments.length}`);
console.log(`Orphan routes: ${orphanRoutes.length}`);
console.log(`Zero-inbound routes: ${zeroInbound.length}`);
console.log(`Dead-end routes: ${deadEnds.length}`);
console.log(`Cross-section connectivity failures: ${connectivityFailures.length}`);
console.log('\nLowest inbound coverage:');
for (const item of lowInbound) console.log(`  ${String(item.inboundPages).padStart(2, ' ')}  ${item.route}`);

if (brokenRoutes.length) {
  console.log('\nBroken internal routes:');
  for (const item of brokenRoutes) console.log(`  ${item.source} -> ${item.href} (${item.target})`);
}
if (brokenFragments.length) {
  console.log('\nBroken hash targets:');
  for (const item of brokenFragments) console.log(`  ${item.source} -> ${item.href}`);
}
if (orphanRoutes.length) {
  console.log('\nOrphan routes:');
  for (const route of orphanRoutes) console.log(`  ${route}`);
}
if (zeroInbound.length) {
  console.log('\nZero-inbound routes:');
  for (const route of zeroInbound) console.log(`  ${route}`);
}
if (deadEnds.length) {
  console.log('\nDead-end routes:');
  for (const route of deadEnds) console.log(`  ${route}`);
}
if (connectivityFailures.length) {
  console.log('\nCross-section connectivity failures:');
  for (const failure of connectivityFailures) console.log(`  ${failure}`);
}

if (brokenRoutes.length || brokenFragments.length || orphanRoutes.length || zeroInbound.length || deadEnds.length || connectivityFailures.length) process.exitCode = 1;
