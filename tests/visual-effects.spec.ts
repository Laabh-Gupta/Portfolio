import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ reducedMotion: 'no-preference' });

test('point sculpture renders immediately and pauses when the hero leaves view', async ({
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
  const points = page.locator('.orbit-points');
  const rain = page.locator('.intro-code-rain');
  await expect(hero).toHaveAttribute('data-animate', 'true');
  await expect(hero.locator('.intro-orbit')).toBeVisible();
  await expect(points.locator('circle')).toHaveCount(1600);
  await expect(hero.locator('.intro-sculpture')).toHaveAttribute('aria-hidden', 'true');
  await expect(rain.locator('span')).toHaveCount(13);
  await expect(points).toHaveCSS('animation-play-state', 'running');
  await expect(rain.locator('span').first()).toHaveCSS('animation-play-state', 'running');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  expect(
    await page.evaluate(
      () => (window as unknown as { portfolioWebGLRequests: number }).portfolioWebGLRequests,
    ),
  ).toBe(0);
  await page.screenshot({ path: info.outputPath('hero-point-sculpture.png') });
  await page
    .locator('#experience')
    .evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(hero).toHaveAttribute('data-animate', 'false');
  await expect(points).toHaveCSS('animation-play-state', 'paused');
  await expect(rain.locator('span').first()).toHaveCSS('animation-play-state', 'paused');
  await hero.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(hero).toHaveAttribute('data-animate', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(points).toHaveCSS('animation-name', 'none');
  await expect(rain.locator('span').first()).toHaveCSS('animation-name', 'none');
  await expect(hero.locator('.intro-orbit')).toBeVisible();
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
  await expect(page.locator('.intro-orbit')).toBeVisible();
  await expect(page.locator('.orbit-points circle')).toHaveCount(1600);
  await expect(page.locator('.intro canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(page).toHaveURL(/projects\/argulab$/);
  expect(errors).toEqual([]);
});

test('hero motion pauses while the document is hidden and resumes when visible', async ({
  page,
}) => {
  await page.goto('/');
  const hero = page.locator('.intro');
  const points = hero.locator('.orbit-points');
  const rain = hero.locator('.intro-code-rain span').first();
  await expect(hero).toHaveAttribute('data-animate', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(hero).toHaveAttribute('data-animate', 'false');
  await expect(points).toHaveCSS('animation-play-state', 'paused');
  await expect(rain).toHaveCSS('animation-play-state', 'paused');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(hero).toHaveAttribute('data-animate', 'true');
  await expect(points).toHaveCSS('animation-play-state', 'running');
  await expect(rain).toHaveCSS('animation-play-state', 'running');
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
  await expect(page.locator('.intro-orbit')).toBeVisible();
  await expect(page.locator('.orbit-points circle')).toHaveCount(1600);
  await expect(page.locator('.intro canvas')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      performance.getEntriesByType('resource').some((r) => /scene-.*\.js/.test(r.name)),
    ),
  ).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.intro-code-rain')).toHaveCSS('display', 'none');
  await expect(page.locator('.intro-orbit')).toBeVisible();
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
