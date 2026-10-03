import { test, expect } from '@playwright/test';

test('shared explorer URLs hydrate correctly and land at their section', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Navigation contracts run once.');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?skill=backend&workflow=remember#skills');
  await expect(page.getByRole('tab', { name: /Backend/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.skill-panel:not([inert])')).toContainText(
    'Reliable boundaries. Useful APIs.',
  );
  await expect(page.getByRole('tab', { name: /Remember/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect
    .poll(() => page.locator('#skills').evaluate((el) => el.getBoundingClientRect().top))
    .toBeLessThan(120);
  await page.goto('/projects/argulab?view=quality&step=context#architecture');
  await expect(page.getByRole('tab', { name: 'Delivery & quality' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('button', { name: /User context/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect
    .poll(() => page.locator('#architecture').evaluate((el) => el.getBoundingClientRect().top))
    .toBeLessThan(120);
  expect(errors).toEqual([]);
});

test('explorer changes and browser history preserve position across routes', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'Navigation contracts run once.');
  await page.goto('/#argulab');
  const remember = page.getByRole('tab', { name: /Remember/ });
  await remember.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await remember.click();
  await expect(page).toHaveURL(/workflow=remember#argulab$/);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(4);
  await page.goBack();
  await expect(page.getByRole('tab', { name: /Practice/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - before))
    .toBeLessThan(4);
  await page.goForward();
  await expect(remember).toHaveAttribute('aria-selected', 'true');
  const caseLink = page.getByRole('link', { name: 'Explore case study' });
  await caseLink.scrollIntoViewIfNeeded();
  const departure = await page.evaluate(() => window.scrollY);
  await caseLink.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ArguLab.');
  await page.getByRole('link', { name: 'Architecture', exact: true }).click();
  await expect(page).toHaveURL(/#architecture$/);
  await page.goBack();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laabh Gupta.');
  await expect(remember).toHaveAttribute('aria-selected', 'true');
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - departure))
    .toBeLessThan(4);
});

test('project focus is stable until activation and invalid URL states fall back', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'Navigation contracts run once.');
  await page.goto('/?project=invalid&skill=invalid#workbench');
  const first = page.getByRole('button', { name: 'Virtual Try-On', exact: true });
  const journal = page.getByRole('button', { name: 'Daily Journal', exact: true });
  await journal.focus();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(journal).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(journal).toHaveAttribute('aria-expanded', 'true');
  await expect(page).toHaveURL(/project=daily-journal/);
  await page.reload();
  await expect(journal).toHaveAttribute('aria-expanded', 'true');
  await page.goto(new URL('#about', page.url()).href);
  await expect
    .poll(() => page.locator('#about').evaluate((el) => el.getBoundingClientRect().top))
    .toBeLessThan(120);
  await page.goto(new URL('#contact', page.url()).href);
  await expect(page.getByRole('link', { name: 'Let’s talk by email' })).toBeInViewport();
});
