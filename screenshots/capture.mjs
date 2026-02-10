import { chromium } from 'playwright';

const pages = [
  { name: '01-home', path: '/' },
  { name: '02-bookclub', path: '/bookclub' },
  { name: '03-narration', path: '/narration' },
  { name: '04-listening', path: '/listening' },
  { name: '05-writing', path: '/writing' },
  { name: '06-review', path: '/review' },
  { name: '07-mypage', path: '/mypage' },
  { name: '08-mall', path: '/mall' },
  { name: '09-ranking', path: '/ranking' },
  { name: '10-booklist', path: '/booklist' },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const p of pages) {
  const page = await context.newPage();
  await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `/Users/ks.kim/Documents/kks/ogeoseo/screenshots/${p.name}.png`,
    fullPage: true,
  });
  console.log(`Captured: ${p.name}`);
  await page.close();
}

await browser.close();
console.log('Done!');
