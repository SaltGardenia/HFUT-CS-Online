/* 大二上批次课程页视觉核查：桌面 1440px 全页 + 局部，输出到 _audit/d2s_shots/ */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5173/HFUT-CS-Online/#';
const OUT = path.join(__dirname, '..', '_audit', 'd2s_shots');

const TARGETS = process.argv[2]
  ? [[process.argv[2], process.argv[3]]]
  : [
      ['py-home', '/py'],
      ['py-ch1', '/py/chapter/deck1'],
      ['py-ch4', '/py/chapter/deck4'],
      ['py-att', '/py/attachments'],
    ];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1440,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console]', m.text().slice(0, 300));
  });
  for (const [name, route] of TARGETS) {
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log('ok', name);
    } catch (e) {
      console.log('FAIL', name, String(e).slice(0, 200));
    }
  }
  await browser.close();
})();
