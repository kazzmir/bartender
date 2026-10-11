import { test, expect, chromium } from '@playwright/test';

test('multiple customers, targeted drag serving, and context loss', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#world canvas')).toBeVisible();
  await expect(page.locator('#customer-queue button')).toHaveCount(2);
  await expect(page.locator('#customer-queue button')).toHaveCount(3, { timeout: 22000 });
  for (const key of ['1', '4', '5', 'Space']) await page.keyboard.press(key);
  await expect(page.locator('#mix span')).toHaveText('Mixed ✓');
  const dragTo = async (x, y) => {
    const glass = await page.locator('#glass-toggle').boundingBox();
    await page.mouse.move(glass.x + glass.width / 2, glass.y + glass.height / 2);
    await page.mouse.down();
    await page.mouse.move(x, y, { steps: 4 });
    await page.mouse.up();
  };
  // Sofia at the left of the bar ordered a Negroni, not an Old Fashioned.
  await dragTo(440, 460);
  await expect(page.locator('#toast')).toContainText('Not SOFIA');
  await expect(page.locator('#served')).toHaveText('0');
  await expect(page.locator('#pour-count')).toHaveText('3 pours');
  await page.waitForTimeout(1800);
  // Serve James in the center by picking up the actual 3D glass.
  await page.mouse.move(838, 540);
  await page.mouse.down();
  await page.mouse.move(720, 460, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('#served')).toHaveText('1');
  await expect(page.locator('#pour-count')).toHaveText('0 pours');
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowRight');
  await page.evaluate(() => document.querySelector('#world canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await expect(page.locator('#graphics-error')).toBeVisible();
  expect(errors).toEqual([]);
});

test('unsupported WebGL displays diagnostics and pauses patience', async () => {
  const browser = await chromium.launch({ args: ['--disable-webgl'] });
  try {
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5174');
    await expect(page.locator('#graphics-error')).toBeVisible();
    const timer = await page.locator('#timer').textContent();
    await page.waitForTimeout(1200);
    await expect(page.locator('#timer')).toHaveText(timer);
  } finally { await browser.close(); }
});
