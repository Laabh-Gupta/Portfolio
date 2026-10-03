import { test, expect } from '@playwright/test';

const sizes = [
  [1366, 768],
  [1440, 900],
  [1920, 1080],
  [1024, 900],
  [768, 1024],
  [390, 844],
  [375, 812],
  [320, 740],
];
for (const [width, height] of sizes) {
  test(`polish composition at ${width}x${height}`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'Explicit viewport matrix runs once.');
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Laabh Gupta.', exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const name = (await page.locator('.hero-name').boundingBox())!;
    const roles = (await page.locator('.hero-roles').boundingBox())!;
    expect(name.y + name.height).toBeLessThan(roles.y);
    await page.screenshot({ path: info.outputPath(`hero-${width}.png`) });
    for (const id of ['projects', 'experience', 'about', 'skills', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
      ).toBe(false);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: info.outputPath(`${id}-${width}.png`) });
      }
    }
    await page.goto('/projects/argulab');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('ArguLab.');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
    await page.screenshot({ path: info.outputPath(`case-${width}.png`) });
    expect(errors).toEqual([]);
  });
}

test('one atmosphere survives routes, varies by chapter and becomes a still under reduced motion', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'Shared renderer lifecycle runs once.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const field = page.locator('.flow-field');
  await expect(field).toHaveCount(1);
  await expect(field).toHaveAttribute('data-section', 'hero');
  const original = await field.elementHandle();
  for (const section of ['experience', 'about', 'skills', 'contact']) {
    await page
      .locator(`#${section}`)
      .evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await expect(field).toHaveAttribute('data-section', section);
  }
  await expect(field).toHaveAttribute('data-motion', 'settled');
  const pixels = () => field.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  const settled = await pixels();
  await page.waitForTimeout(250);
  expect(await pixels()).toBe(settled);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(field).toHaveAttribute('data-motion', 'static');
  const still = await pixels();
  expect(
    await field.evaluate((el) => {
      const canvas = el as HTMLCanvasElement;
      return canvas
        .getContext('2d')!
        .getImageData(0, 0, canvas.width, canvas.height)
        .data.some((v, i) => i % 4 === 3 && v > 0);
    }),
  ).toBe(true);
  await page.mouse.move(400, 400);
  await page.waitForTimeout(250);
  expect(await pixels()).toBe(still);
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(field).toHaveAttribute('data-section', 'case');
  await expect(field).toHaveCount(1);
  expect(await original!.evaluate((el) => el.isConnected)).toBe(true);
});
