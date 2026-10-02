import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ reducedMotion: 'no-preference' });

test('3D loading preserves identity, then settles without idle GPU work', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/assets/scene-*.js', async (route) => {
    await gate;
    await route.continue();
  });
  await page.addInitScript(() => {
    const metrics = { draws: 0 };
    Object.assign(window, { portfolioGpuMetrics: metrics });
    const arrays = WebGL2RenderingContext.prototype.drawArrays;
    WebGL2RenderingContext.prototype.drawArrays = function (...args) {
      metrics.draws++;
      return arrays.apply(this, args);
    };
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      metrics.draws++;
      return original.apply(this, args);
    };
  });
  await page.goto('/');
  const stage = page.locator('.identity-stage');
  await expect(stage).toHaveAttribute('data-render', 'loading');
  await expect(page.getByTestId('identity-fallback')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  release();
  await expect(stage).toHaveAttribute('data-render', 'webgl');
  await expect(stage.locator('canvas')).toBeVisible();
  const draws = () =>
    page.evaluate(
      () =>
        (window as unknown as { portfolioGpuMetrics: { draws: number } }).portfolioGpuMetrics.draws,
    );
  await expect.poll(draws).toBeGreaterThan(0);
  await page.waitForTimeout(300);
  const settled = await draws();
  await page.waitForTimeout(450);
  expect(await draws()).toBe(settled);
  const box = (await stage.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.4);
  await expect.poll(draws).toBeGreaterThan(settled);
  await page.mouse.move(15, 15);
  await page.waitForTimeout(1000);
  const resting = await draws();
  await page.waitForTimeout(450);
  expect(await draws()).toBe(resting);
  await page.screenshot({ path: info.outputPath('hero-webgl.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stage).toHaveAttribute('data-render', 'static');
  await expect(stage.locator('canvas')).toHaveCount(0);
  await expect(page.getByTestId('identity-fallback')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(stage).toHaveAttribute('data-render', 'webgl');
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ArguLab.');
  expect(errors).toEqual([]);
});

test('unavailable WebGL leaves a complete working portfolio', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (kind === 'webgl2') return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.identity-stage')).toHaveAttribute('data-render', 'fallback');
  await expect(page.getByTestId('identity-fallback')).toHaveCSS('opacity', '1');
  await expect(page.locator('.identity-stage canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(page).toHaveURL(/projects\/argulab$/);
  expect(errors).toEqual([]);
});

test('WebGL context loss returns to static artwork', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.identity-stage')).toHaveAttribute('data-render', 'webgl');
  await page.locator('.identity-stage canvas').evaluate((canvas) => {
    const gl = (canvas as HTMLCanvasElement).getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await expect(page.locator('.identity-stage')).toHaveAttribute('data-render', 'fallback');
  await expect(page.locator('.identity-stage canvas')).toHaveCount(0);
  await expect(page.getByTestId('identity-fallback')).toHaveCSS('opacity', '1');
});

test('touch displays never download the optional renderer', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL + '/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  await expect(page.locator('.identity-stage')).toHaveAttribute('data-render', 'static');
  expect(
    await page.evaluate(() =>
      performance.getEntriesByType('resource').some((r) => /scene-.*\.js/.test(r.name)),
    ),
  ).toBe(false);
  await context.close();
});

test('1024px layout, keyboard focus, and contact flow remain usable', async ({ page }, info) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.locator('.flow-field')).toHaveAttribute('data-motion', 'running');
  await expect(page.locator('.flow-field')).toHaveAttribute('data-motion', 'settled', {
    timeout: 10000,
  });
  await page.screenshot({ path: info.outputPath('contact-1024.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.flow-field')).toHaveAttribute('data-motion', 'static');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Email copied');
});

test('project spotlight is local and retains native touch scrolling', async ({ page }) => {
  await page.goto('/#argulab');
  const card = page.locator('#argulab');
  await expect(card).toBeVisible();
  const box = (await card.boundingBox())!;
  await card.hover({ position: { x: box.width * 0.6, y: 80 } });
  await expect
    .poll(() =>
      card.evaluate((el) =>
        el instanceof HTMLElement ? el.style.getPropertyValue('--glow-x') : '',
      ),
    )
    .not.toBe('');
  expect(await card.evaluate((el) => getComputedStyle(el).touchAction)).not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('transition-duration', '0s');
});
