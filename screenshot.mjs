import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.mitsubishi-motors.com/jp/sustainability/contribution/people/kids/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:\\Users\\Tatsuki\\.gemini\\antigravity\\brain\\faf2f6ef-ec93-4539-83ba-0dfa8d070b79\\reference_site.png', fullPage: true });
  await browser.close();
})();
