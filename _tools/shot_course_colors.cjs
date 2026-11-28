/* 一课一色改动抽查截图：多课程 × 亮暗两态（puppeteer-core + 本机 Chrome） */
const puppeteer = require('puppeteer-core');

const BASE = 'http://localhost:5210/HFUT-CS-Online/#';
const OUT = 'C:/Users/icepa/tmp/wt-coursecolor/_tools/shots';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1280,900'],
  });

  const shot = async (route, file, { dark = false, fullPage = false } = {}) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
    await page.evaluateOnNewDocument((d) => {
      localStorage.setItem('hb-theme', d ? 'dark' : 'light');
      localStorage.setItem('theme', d ? 'dark' : 'light');
    }, dark);
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/${file}.png`, fullPage });
    await page.close();
    console.log('shot', file);
  };

  await shot('/algo', 'light-algo-home');
  await shot('/algo/deck/deck3', 'light-algo-deck3');
  await shot('/algo/practice', 'light-algo-practice');
  await shot('/os/chapter/ch3', 'light-os-ch3');
  await shot('/os/practice', 'light-os-practice');
  await shot('/nap/attachments', 'light-nap-att');
  await shot('/cv', 'light-cv-home');
  await shot('/db', 'light-db-home');
  await shot('/maogai', 'light-maogai');
  await shot('/algo/practice', 'dark-algo-practice', { dark: true });
  await shot('/os/chapter/ch3', 'dark-os-ch3', { dark: true });
  await shot('/db', 'dark-db-home', { dark: true });
  await shot('/phys/practice', 'dark-phys-practice', { dark: true });

  await browser.close();
})();
