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

  const shotAt = async (path, secId, name, offset = 0) => {
    await page.goto(`http://localhost:5173/HFUT-CS-Online/#${path}?s=${secId}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1100));
    if (offset) {
      await page.evaluate((o) => window.scrollBy({ top: o, behavior: 'instant' }), offset);
      await new Promise((r) => setTimeout(r, 300));
    }
    await page.screenshot({ path: `_tools/lab_out/${name}.png` });
    console.log('shot', name);
  };

  await shotAt('/aie/deck/deck7', 'sec-aie7-model', 'sec-aie7-model-a', 0);
  await shotAt('/aie/deck/deck7', 'sec-aie7-model', 'sec-aie7-model-b', 1100);
  await shotAt('/aie/deck/deck7', 'sec-aie7-industry', 'sec-aie7-industry', 0);
  await shotAt('/sec/deck/deck2', 'sec-sec2-modes', 'sec-sec2-modes-a', 0);
  await shotAt('/sec/deck/deck2', 'sec-sec2-modes', 'sec-sec2-modes-b', 1200);
  await shotAt('/sec/deck/deck2', 'sec-sec2-stream', 'sec-sec2-stream-a', 0);
  await shotAt('/sec/deck/deck2', 'sec-sec2-stream', 'sec-sec2-stream-b', 1200);
  await shotAt('/sec/deck/deck2', 'sec-sec2-stream', 'sec-sec2-stream-c', 2400);
  await shotAt('/sec/deck/deck7', 'sec-sec7-dp', 'sec-sec7-dp', 0);
  await shotAt('/sec/deck/deck7', 'sec-sec7-he', 'sec-sec7-he-a', 0);
  await shotAt('/sec/deck/deck7', 'sec-sec7-he', 'sec-sec7-he-b', 1100);
  await shotAt('/sec/deck/deck4', 'sec-sec4-sig', 'sec-sec4-sig', 0);
  await shotAt('/sec/deck/deck6', 'sec-sec6-xss', 'sec-sec6-xss', 0);
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
