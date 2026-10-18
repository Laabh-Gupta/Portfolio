import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ reducedMotion: 'no-preference' });

async function readyAvatar(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const slot = page.locator('.floating-avatar-slot');
  const traveller = page.locator('.floating-avatar-traveller');
  await expect(slot).toHaveAttribute('data-avatar-ready', 'true');
  await expect(traveller).toHaveAttribute('data-ready', 'true');
  await expect
    .poll(() =>
      traveller
        .locator('img')
        .evaluate(
          (el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0,
        ),
    )
    .toBe(true);
  return { slot, traveller };
}

async function withinViewport(page: Page, locator: Locator) {
  const box = (await locator.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  return box;
}

test('illustrated avatar loads once accessibly and its floating motion follows document visibility', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const { traveller } = await readyAvatar(page);
  await expect(
    page.getByRole('img', { name: 'Illustrated avatar of Laabh Gupta', exact: true }),
  ).toHaveCount(1);
  await expect(traveller).toHaveAttribute('data-state', 'hero');
  await expect(traveller).toHaveAttribute('data-motion', 'floating');
  await expect(traveller.locator('.floating-avatar-art')).toHaveCSS(
    'animation-name',
    'avatar-float',
  );
  await page.screenshot({ path: info.outputPath('hero-illustrated-avatar.png') });
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(traveller).toHaveAttribute('data-hidden', 'true');
  await expect(traveller).toHaveAttribute('data-motion', 'paused');
  await expect(traveller.locator('.floating-avatar-art')).toHaveCSS('animation-name', 'none');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(traveller).toHaveAttribute('data-hidden', 'false');
  await expect(traveller).toHaveAttribute('data-motion', 'floating');
  expect(errors).toEqual([]);
});

test('scroll shrinks the avatar into its corner and reverses without moving the reserved hero layout', async ({
  page,
}) => {
  await page.goto('/');
  const { slot, traveller } = await readyAvatar(page);
  const original = (await slot.boundingBox())!;
  const heroSize = (await traveller.boundingBox())!.width;
  const headerHeight = (await page.locator('.site-header').boundingBox())!.height;
  const travelStart = Math.max(0, original.y - headerHeight - 14 - 64);
  const travelDistance = Math.max(180, Math.min(360, original.width * 0.72));
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    travelStart + travelDistance / 2,
  );
  await expect(traveller).toHaveAttribute('data-state', 'travelling');
  const travelling = (await traveller.boundingBox())!;
  expect(travelling.width).toBeLessThan(heroSize);
  await page
    .locator('#projects')
    .evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(traveller).toHaveAttribute('data-state', 'docked');
  const docked = await withinViewport(page, traveller);
  expect(docked.width).toBeLessThan(heroSize / 2);
  const reserved = await slot.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { y: rect.top + window.scrollY, width: rect.width, height: rect.height };
  });
  expect(reserved.y).toBeCloseTo(original.y, 0);
  expect(reserved.width).toBeCloseTo(original.width, 0);
  expect(reserved.height).toBeCloseTo(original.height, 0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(traveller).toHaveAttribute('data-state', 'hero');
  const restored = (await traveller.boundingBox())!;
  expect(restored.width).toBeCloseTo(heroSize, 0);
  expect(restored.x).toBeCloseTo(original.x, 0);
  expect(restored.y).toBeCloseTo(original.y, 0);
});

test('direct contact loads dock correctly, Back to top works by keyboard and bare-home navigation resets the avatar', async ({
  page,
}) => {
  await page.goto('/#contact');
  const { traveller } = await readyAvatar(page);
  await expect(traveller).toHaveAttribute('data-state', 'docked');
  await withinViewport(page, traveller);
  const back = page.getByRole('button', { name: 'Back to top', exact: true });
  await back.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(traveller).toHaveAttribute('data-state', 'hero');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await expect(traveller).toHaveAttribute('data-state', 'docked');
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ArguLab.');
  await expect(page.locator('.floating-avatar-traveller')).toHaveCount(0);
  await page.getByRole('link', { name: 'Laabh Gupta home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(page.locator('.floating-avatar-traveller')).toHaveAttribute('data-state', 'hero');
});

test('reduced motion keeps the illustration still and snaps between hero and dock', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const { traveller } = await readyAvatar(page);
  await expect(traveller).toHaveAttribute('data-motion', 'static');
  await expect(traveller.locator('.floating-avatar-art')).toHaveCSS('animation-name', 'none');
  const still = await traveller.locator('img').boundingBox();
  await page.waitForTimeout(200);
  expect(await traveller.locator('img').boundingBox()).toEqual(still);
  await page
    .locator('#projects')
    .evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await expect(traveller).toHaveAttribute('data-state', 'docked');
  await expect(traveller).toHaveAttribute('data-motion', 'static');
  await withinViewport(page, traveller);
  await page.getByRole('button', { name: 'Back to top', exact: true }).click();
  await expect(traveller).toHaveAttribute('data-state', 'hero');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
});

for (const width of [390, 320]) {
  test(`docked avatar leaves navigation and contact controls unobstructed at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/#contact');
    const { traveller } = await readyAvatar(page);
    await expect(traveller).toHaveAttribute('data-state', 'docked');
    await withinViewport(page, traveller);
    const copy = page.getByRole('button', { name: 'Copy email address' });
    await copy.scrollIntoViewIfNeeded();
    await expect(copy).toBeInViewport();
    expect(
      await copy.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return el.contains(
          document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2),
        );
      }),
    ).toBe(true);
    await copy.click();
    await expect(page.getByRole('status')).toHaveText('Email copied');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(traveller).toHaveAttribute('data-hidden', 'true');
    await expect(traveller).toHaveAttribute('data-motion', 'paused');
    await expect(traveller).toHaveAttribute('inert', '');
    await dialog.getByRole('link', { name: 'Experience', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(traveller).toHaveAttribute('data-hidden', 'false');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });
}

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
