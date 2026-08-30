/**
 * Build-time prerender: serves dist/, renders the page in headless Chrome
 * with prefers-reduced-motion (so no animation-hidden states are baked in),
 * and snapshots the full HTML back into dist/index.html.
 *
 * Result: the hero paints from static HTML immediately (LCP), then React
 * mounts on top and takes over interactivity. GTM requests are blocked
 * during the snapshot so no injected tags or dataLayer state leak into it.
 *
 * Runs as `postbuild`. Chrome comes from $CHROME_PATH, or the standard
 * macOS / Linux (GitHub Actions ubuntu runner) locations.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { writeFileSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';
import puppeteer from 'puppeteer-core';

const DIST = new URL('../dist', import.meta.url).pathname;

const CHROME =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(
    existsSync,
  );
if (!CHROME) {
  console.error('prerender: no Chrome found — skipping (set CHROME_PATH to enable)');
  process.exit(0);
}

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  try {
    const body = await readFile(join(DIST, path));
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setRequestInterception(true);
page.on('request', (req) => {
  if (req.url().includes('googletagmanager.com')) req.abort();
  // Answer the coming-soon flag deterministically so the snapshot never
  // depends on live API state or latency. Default bakes the full site;
  // PRERENDER_GATE=1 bakes the teaser instead (a "stealth" build whose HTML
  // reveals nothing while the gate is up). Visitors always get the *live*
  // verdict at runtime either way — this only decides the pre-hydration
  // paint and what crawlers see.
  else if (req.url().includes('/app/site-config'))
    req.respond({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { comingSoon: Boolean(process.env.PRERENDER_GATE) },
      }),
    });
  else req.continue();
});
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));

let html = await page.evaluate(() => {
  // Lenis stamps classes on <html> at runtime; keep the snapshot clean.
  document.documentElement.className = '';
  // The coming-soon boot stamps data-gate; live loads must decide it fresh.
  delete document.documentElement.dataset.gate;
  // The GTM bootstrap injected this tag at runtime — it must not be baked in,
  // or the live page would load gtm.js twice (the bootstrap re-injects it).
  document.querySelectorAll('script[src*="googletagmanager.com"]').forEach((s) => s.remove());
  return '<!doctype html>\n' + document.documentElement.outerHTML;
});

// Inline the stylesheet: with the HTML prerendered, this removes the last
// render-blocking request — first paint needs nothing but the document.
const cssLink = html.match(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (cssLink) {
  const css = await readFile(join(DIST, cssLink[1]), 'utf8');
  html = html.replace(cssLink[0], `<style>${css}</style>`);
}

writeFileSync(join(DIST, 'index.html'), html);
console.log(`prerender: dist/index.html snapshot written (${(html.length / 1024).toFixed(0)} KB)`);

await browser.close();
server.close();
