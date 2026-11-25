/* 课程页局部视口截图：node _tools/shot_d2s_view.cjs <route> <name> [scroll...] */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5173/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'd2s_shots');

(async () => {
  const [route, name, ...scrolls] = process.argv.slice(2);
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));
  const ys = scrolls.length ? scrolls.map(Number) : [0];
  for (const y of ys) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await new Promise((r) => setTimeout(r, 350));
    await page.screenshot({ path: path.join(OUT, `${name}-${y}.png`) });
    console.log('ok', name, y);
  }
  await browser.close();
})();
