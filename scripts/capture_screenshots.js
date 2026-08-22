import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function captureSiteScreenshots() {
  const outputDir = path.resolve('screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to live app...');
  await page.goto('https://munnartools.vercel.app', { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Home Tab Screenshot
  console.log('Capturing 1. Home Tab...');
  await page.screenshot({ path: path.join(outputDir, '1_home_tab.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  // 2. Open Fuel Calculator Tab
  console.log('Capturing 2. Fuel Calculator...');
  await page.evaluate(() => {
    const fuelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fuel'));
    if (fuelBtn) fuelBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '2_fuel_calculator.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  // 3. Open Route Distance Modal
  console.log('Capturing 3. Route Distance Modal...');
  await page.evaluate(() => {
    const routeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Route Finder') || b.textContent.includes('Route Distance'));
    if (routeBtn) routeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '3_route_modal.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  // Close Modal
  await page.evaluate(() => {
    const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cancel') || b.textContent.includes('Apply'));
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 4. Open Cost Predictor Tab
  console.log('Capturing 4. Cost Predictor...');
  await page.evaluate(() => {
    const predBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Budget') || b.textContent.includes('Cost Predictor'));
    if (predBtn) predBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '4_cost_predictor.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  // 5. Open Expense Tracker Tab
  console.log('Capturing 5. Expense Tracker...');
  await page.evaluate(() => {
    const trackerBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ledger') || b.textContent.includes('Expense Tracker'));
    if (trackerBtn) trackerBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '5_expense_tracker.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  // 6. Open Analytics Tab
  console.log('Capturing 6. Analytics...');
  await page.evaluate(() => {
    const anaBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Stats') || b.textContent.includes('Analytics'));
    if (anaBtn) anaBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '6_analytics.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  // 7. Open Report Tab
  console.log('Capturing 7. Reports...');
  await page.evaluate(() => {
    const repBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Report') || b.textContent.includes('Reports'));
    if (repBtn) repBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outputDir, '7_reports.png'), clip: { x: 0, y: 0, width: 1280, height: 850 } });

  await browser.close();
  console.log('✅ All screenshots captured successfully in screenshots/');
}

captureSiteScreenshots().catch(err => {
  console.error('Screenshot capture error:', err);
  process.exit(1);
});
