import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function ready(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('main')).toBeVisible();
}
async function noOverflow(page: Page) {
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return (
          box.width > 0 &&
          style.position !== 'fixed' &&
          !el.closest('svg') &&
          !el.classList.contains('sr-only') &&
          (box.right > document.documentElement.clientWidth + 1 || box.left < -1)
        );
      })
      .map((el) => `${el.tagName}.${el.className}`),
  );
  expect(offenders).toEqual([]);
}

test('home content, responsive layout, console and accessibility', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await ready(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  await expect(
    page.getByRole('heading', { name: 'AI & Data Engineer', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI & Data Intern', exact: true })).toBeVisible();
  await expect(page.locator('.modes-grid')).toHaveCount(0);
  await noOverflow(page);
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  await page.screenshot({ path: info.outputPath('home.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('project filters and evidence-backed skill tabs work by keyboard', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Software', exact: true }).click();
  await expect(page.locator('.selected-project')).toHaveCount(2);
  await expect(page.locator('.selected-projects')).not.toContainText('Virtual Try-On');
  await page.getByRole('button', { name: 'All work', exact: true }).click();
  await expect(page.locator('.selected-project')).toHaveCount(5);
  await page.getByRole('tab', { name: /Cloud/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('not large-scale production experience');
  await page.getByRole('tab', { name: /MLOps \/ DevOps/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('DVC, Kubernetes and KServe');
  await page.getByRole('tab', { name: /AI \/ ML/ }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: /GenAI/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tabpanel')).toContainText('AI with an application around it.');
  await noOverflow(page);
});

test('ArguLab case study modes, personalization, architecture and navigation', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore case study' }).click();
  await ready(page);
  await expect(page).toHaveURL(/\/projects\/argulab$/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /^Inside ArguLab/,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /^ArguLab/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ArguLab.');
  await expect(page.locator('.mode-card')).toHaveCount(9);
  await page
    .locator('.mode-card')
    .filter({ hasText: 'Observer Analysis' })
    .locator('summary')
    .click();
  await expect(
    page.getByText('Study a conversation and analyze the arguments being made.'),
  ).toBeVisible();
  await page.getByRole('button', { name: /User context/ }).click();
  await expect(page.locator('#loop-detail')).toContainText('Persist user context');
  await page.getByRole('button', { name: /Next session/ }).click();
  await expect(page.locator('#loop-detail')).toContainText('Context-aware future practice');
  await page.getByRole('tab', { name: 'AI & audio workflows' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('whisper-large-v3-turbo');
  await expect(page.getByRole('tabpanel')).toContainText('openai/gpt-oss-120b');
  await page.getByRole('tab', { name: 'Delivery & quality' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('47');
  await expect(page.getByRole('tabpanel')).toContainText('21');
  await page.getByRole('tab', { name: 'System architecture' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('PostgreSQL');
  await noOverflow(page);
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  await page.screenshot({ path: info.outputPath('case-study.png'), fullPage: true });
  await page.getByRole('link', { name: 'Back to selected work' }).click();
  await expect(page).toHaveURL(/#argulab$/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /^AI & Data Engineer/,
  );
  expect(errors).toEqual([]);
});

test('mobile navigation manages focus, Escape and anchor selection', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop', 'Mobile menu is hidden on desktop.');
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await dialog.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#experience$/);
  await expect
    .poll(() =>
      page.locator('#experience').evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBeLessThan(150);
  await noOverflow(page);
});

test('resume download, metadata, deep routes and static content', async ({ page, request }) => {
  await page.goto('/');
  await ready(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download resume', exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('Laabh_Gupta_Resume.pdf');
  for (const path of ['/', '/projects/argulab']) {
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toContain('application/ld+json');
    expect(html).toContain('og:image');
    expect(html).toContain('<h1');
    expect(html).toContain(`data-route="${path}"`);
    const serverHeading = html
      .match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      .replace(/<!--[\s\S]*?-->|<[^>]+>/g, '');
    expect(serverHeading).toBe(path === '/' ? 'Laabh Gupta.' : 'ArguLab.');
    expect(html).not.toContain('<!--app-html-->');
  }
  for (const path of [
    '/robots.txt',
    '/sitemap.xml',
    '/social-card.png',
    '/mark.svg',
    '/Laabh_Gupta_Resume.pdf',
  ])
    expect((await request.get(path)).ok()).toBeTruthy();
  await page.goto('/projects/argulab');
  await ready(page);
  await expect(page).toHaveTitle(/ArguLab/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://laabh-portfolio.netlify.app/projects/argulab',
  );
  await page.goto('/about');
  await expect(page).toHaveURL(/#about$/);
  await page.goto('/not-a-real-page');
  await expect(page.getByRole('heading', { name: 'That path ends here.' })).toBeVisible();
  await expect(page).toHaveTitle('Page not found | Laabh Gupta');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('reduced motion disables CSS animation and smooth scroll', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe(
    'auto',
  );
  expect(
    await page.locator('.identity-fallback').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await expect(page.locator('.identity-stage')).toHaveAttribute('data-render', 'static');
  await expect(page.locator('.identity-stage canvas')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      performance.getEntriesByType('resource').some((r) => r.name.includes('/assets/scene-')),
    ),
  ).toBe(false);
});

test('motion preference changes clean up smooth scrolling without breaking navigation', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'Fine-pointer enhancement is desktop only.');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await ready(page);
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(page).toHaveURL(/#experience$/);
  await expect
    .poll(() =>
      page.locator('#experience').evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBeLessThan(150);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.goto('/#%E0%A4%A');
  await ready(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  expect(errors).toEqual([]);
});

test('direct case-study and anchored home loads hydrate cleanly in narrow desktop windows', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop',
    'Checks the content width of a 320px window with a classic scrollbar.',
  );
  await page.setViewportSize({ width: 305, height: 740 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/projects/argulab');
  await ready(page);
  await page.getByRole('button', { name: /User context/ }).click();
  await expect(page.locator('#loop-detail')).toContainText('Persist user context');
  await noOverflow(page);
  await page.goto('/#contact');
  await ready(page);
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Email copied');
  await noOverflow(page);
  expect(errors).toEqual([]);
});
