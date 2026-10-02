import { test, expect } from '@playwright/test';

test('project walkthrough, gallery and lifecycle map expose the same evidence by keyboard', async ({
  page,
}) => {
  await page.goto('/');
  const workflow = page.getByRole('tablist', { name: 'Explore the ArguLab workflow' });
  await workflow.getByRole('tab', { name: /Remember/ }).click();
  await expect(page.locator('.product-panel:not([inert])')).toContainText('Carry it forward.');
  await workflow.getByRole('tab', { name: /Practice/ }).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.locator('.product-panel:not([inert])')).toContainText('See what matters.');
  const journal = page.getByRole('button', { name: 'Daily Journal', exact: true });
  await journal.focus();
  await page.keyboard.press('Enter');
  await expect(journal).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'View Daily Journal repository' })).toBeVisible();
  await page.getByRole('button', { name: 'AI / ML', exact: true }).click();
  await expect(page.locator('.selected-project')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Virtual Try-On', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  const lifecycle = page.getByRole('group', { name: 'Explore the engineering lifecycle' });
  await lifecycle.getByRole('button', { name: /API/ }).click();
  await expect(page.getByRole('tab', { name: /Backend/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.skill-panel:not([inert])')).toContainText(
    'Reliable boundaries. Useful APIs.',
  );
});

test('compact navigation is usable without a mouse', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Compact navigation is a desktop enhancement.');
  await page.goto('/');
  await page.getByRole('link', { name: 'Experience', exact: true }).click();
  await page.mouse.move(5, 500);
  const menu = page.getByRole('button', { name: 'Expand navigation' });
  await expect(menu).toBeVisible();
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.desktop-links')).not.toHaveAttribute('inert', '');
  await page.keyboard.press('Tab');
  await expect(
    page.locator('.desktop-links').getByRole('link', { name: 'Projects', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#projects$/);
});

test('magnetic actions settle, preserve native targets and disable with reduced motion', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'Fine-pointer enhancement only.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore my work' }).hover();
  const cursor = page.locator('.magnetic-cursor');
  await expect(cursor).toHaveCSS('opacity', '1');
  await expect(cursor).toHaveAttribute('data-motion', 'settled');
  await expect(cursor).toHaveCSS('pointer-events', 'none');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cursor).not.toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/magnetic-enabled/);
});
