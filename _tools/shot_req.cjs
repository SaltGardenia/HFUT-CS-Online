const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    windowSize: { width: 1440, height: 1200 },
    args: ['--window-size=1440,1200', '--proxy-server=http://127.0.0.1:7897'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  const shot = async (path, name, opts = {}) => {
    if (opts.mobile) await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    else await page.setViewport({ width: 1440, height: 1200 });
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate((d) => {
      if (d) document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
    }, !!opts.dark);
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `_tools/lab_out/${name}.png`, fullPage: !opts.viewportOnly });
    console.log('shot', name);
  };

  await shot('/', 'req-home-light');
  await shot('/aie', 'req-aie-home');
  await shot('/aie/deck/deck1', 'req-aie-ch1');
  await shot('/aie/deck/deck7', 'req-aie-ch7');
  await shot('/aie/deck/deck8', 'req-aie-ch8');
  await shot('/aie/attachments', 'req-aie-att');
  await shot('/sec', 'req-sec-home');
  await shot('/sec/deck/deck1', 'req-sec-ch1');
  await shot('/sec/deck/deck2', 'req-sec-ch2');
  await shot('/sec/deck/deck6', 'req-sec-ch6');
  await shot('/sec/deck/deck7', 'req-sec-ch7');
  await shot('/sec/attachments', 'req-sec-att');
  await shot('/aie/deck/deck7', 'req-aie-ch7-dark', { dark: true });
  await shot('/sec/deck/deck2', 'req-sec-ch2-dark', { dark: true });
  await shot('/aie/deck/deck3', 'req-aie-mobile', { mobile: true });
  await shot('/sec/deck/deck4', 'req-sec-mobile', { mobile: true });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
