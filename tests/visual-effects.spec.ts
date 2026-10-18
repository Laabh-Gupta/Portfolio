import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ reducedMotion: 'no-preference' });

test('multi-reference 3D face renders without WebGL, settles and pauses offscreen', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.assign(window, { portfolioWebGLRequests: 0 });
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (kind.startsWith('webgl')) {
        const metrics = window as unknown as { portfolioWebGLRequests: number };
        metrics.portfolioWebGLRequests++;
      }
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  await page.goto('/');
  const hero = page.locator('.intro');
  const portrait = page.getByRole('figure', {
    name: 'Interactive 3D face of Laabh Gupta',
  });
  const canvas = portrait.locator('.portrait-canvas');
  const pixels = () => canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  await expect(portrait).toHaveAttribute('data-ready', 'true');
  await expect(canvas).toBeVisible();
  await expect(portrait).toHaveAttribute('data-reference-count', '7');
  await expect(portrait).toHaveAttribute('data-mode', 'wireframe');
  expect(await portrait.locator('.portrait-fallback path').count()).toBeGreaterThan(100);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  expect(
    await canvas.evaluate((el) => {
      const surface = el as HTMLCanvasElement;
      return surface
        .getContext('2d')!
        .getImageData(0, 0, surface.width, surface.height)
        .data.some((value, index) => index % 4 === 3 && value > 0);
    }),
  ).toBe(true);
  const settled = await pixels();
  await page.waitForTimeout(250);
  expect(await pixels()).toBe(settled);
  expect(
    await page.evaluate(
      () => (window as unknown as { portfolioWebGLRequests: number }).portfolioWebGLRequests,
    ),
  ).toBe(0);
  await page.screenshot({ path: info.outputPath('hero-personal-portrait.png') });
  await page
    .locator('#projects')
    .evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(portrait).toHaveAttribute('data-motion', 'paused');
  const paused = await pixels();
  await page.waitForTimeout(250);
  expect(await pixels()).toBe(paused);
  await hero.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ArguLab.');
  expect(errors).toEqual([]);
});

test('unavailable canvas leaves the geometric SVG face and portfolio usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (this.classList.contains('portrait-canvas')) return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const portrait = page.locator('.face-portrait');
  await expect(portrait.locator('.portrait-fallback')).toBeVisible();
  await expect(portrait.locator('.portrait-fallback')).toHaveCSS('opacity', '1');
  expect(await portrait.locator('.portrait-fallback path').count()).toBeGreaterThan(100);
  await expect(portrait).not.toHaveAttribute('data-ready', 'true');
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(page).toHaveURL(/projects\/argulab$/);
  expect(errors).toEqual([]);
});

test('portrait pauses while the document is hidden and resumes when visible', async ({ page }) => {
  await page.goto('/');
  const portrait = page.locator('.face-portrait');
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  const pixels = () =>
    portrait.locator('canvas').evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(portrait).toHaveAttribute('data-motion', 'paused');
  const paused = await pixels();
  await page.waitForTimeout(200);
  expect(await pixels()).toBe(paused);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
});

test('3D display modes work by keyboard, pointer rotation resets and reduced motion stays still', async ({
  page,
}) => {
  await page.goto('/');
  const portrait = page.locator('.face-portrait');
  const canvas = portrait.locator('.portrait-canvas');
  const pixels = () => canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  const yaw = () =>
    portrait.evaluate((el) => Number((el as HTMLElement).style.getPropertyValue('--portrait-yaw')));
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  const baseYaw = await yaw();
  let previous = await pixels();
  for (const label of ['Solid', 'Points', 'Wireframe']) {
    const control = portrait.getByRole('button', { name: label, exact: true });
    await control.focus();
    await page.keyboard.press('Enter');
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    await expect(portrait.locator('.portrait-controls button[aria-pressed="true"]')).toHaveCount(1);
    await expect.poll(pixels).not.toBe(previous);
    previous = await pixels();
  }
  const box = (await canvas.boundingBox())!;
  await canvas.hover({ position: { x: box.width * 0.8, y: box.height * 0.4 } });
  await expect.poll(async () => Math.abs((await yaw()) - baseYaw)).toBeGreaterThan(0.05);
  await page.mouse.move(10, 10);
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  await expect.poll(async () => Math.abs((await yaw()) - baseYaw)).toBeLessThan(0.001);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(portrait).toHaveAttribute('data-motion', 'static');
  const still = await pixels();
  await canvas.hover({ position: { x: box.width * 0.75, y: box.height * 0.35 } });
  await page.waitForTimeout(200);
  expect(await pixels()).toBe(still);
  expect(Math.abs((await yaw()) - baseYaw)).toBeLessThan(0.001);
});

test('focused face rotates with arrow keys and Home restores its initial pose', async ({
  page,
}) => {
  await page.goto('/');
  const portrait = page.getByRole('figure', { name: 'Interactive 3D face of Laabh Gupta' });
  const yaw = () =>
    portrait.evaluate((el) => Number((el as HTMLElement).style.getPropertyValue('--portrait-yaw')));
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  const initialYaw = await yaw();
  await portrait.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(async () => (await yaw()) - initialYaw).toBeGreaterThan(0.06);
  await page.keyboard.press('Home');
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  await expect.poll(async () => Math.abs((await yaw()) - initialYaw)).toBeLessThan(0.001);
  await expect(portrait).toBeFocused();
});

test('scan performs one pass, announces completion and returns to idle', async ({ page }) => {
  await page.goto('/');
  const portrait = page.locator('.face-portrait');
  const pixels = () =>
    portrait.locator('canvas').evaluate((el) => (el as HTMLCanvasElement).toDataURL());
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  const initial = await pixels();
  await portrait.getByRole('button', { name: 'Scan face', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(portrait).toHaveAttribute('data-scan', 'running');
  await expect(portrait.locator('[aria-live="polite"]')).toHaveText('Scanning the 3D face.');
  await expect.poll(pixels).not.toBe(initial);
  await expect(portrait).toHaveAttribute('data-scan', 'idle');
  await expect(portrait.locator('[aria-live="polite"]')).toHaveText('Scan complete.');
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  const finished = await pixels();
  await page.waitForTimeout(250);
  expect(await pixels()).toBe(finished);
  await expect(portrait).toHaveAttribute('data-scan', 'idle');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(portrait).toHaveAttribute('data-motion', 'static');
  await page.keyboard.press('Enter');
  await expect(portrait.locator('[aria-live="polite"]')).toContainText('reduced-motion preference');
  await expect(portrait).toHaveAttribute('data-scan', 'idle');
});

test('touch keeps portrait modes usable without tilt or an optional renderer', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL + '/');
  const portrait = page.locator('.face-portrait');
  await expect(portrait).toHaveAttribute('data-ready', 'true');
  await expect(portrait).toHaveAttribute('data-motion', 'settled');
  const initialYaw = await portrait.evaluate((el) =>
    Number((el as HTMLElement).style.getPropertyValue('--portrait-yaw')),
  );
  await portrait.getByRole('button', { name: 'Solid', exact: true }).tap();
  await expect(portrait).toHaveAttribute('data-mode', 'solid');
  expect(
    await portrait.evaluate((el) =>
      Number((el as HTMLElement).style.getPropertyValue('--portrait-yaw')),
    ),
  ).toBe(initialYaw);
  expect(
    await portrait.locator('canvas').evaluate((el) => getComputedStyle(el).touchAction),
  ).not.toBe('none');
  expect(
    await page.evaluate(() =>
      performance.getEntriesByType('resource').some((r) => /scene-.*\.js/.test(r.name)),
    ),
  ).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(portrait).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
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
