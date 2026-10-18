import { test, expect } from '@playwright/test';

test('project walkthrough, gallery and skill families expose the same evidence by keyboard', async ({
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
  await page.getByRole('tab', { name: /Frontend/ }).focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
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

test('career disclosures and the new work showcase expose the engineering behind each project', async ({
  page,
}) => {
  await page.goto('/');
  const flagship = page.locator('.work-flagship');
  await expect(flagship.getByRole('heading', { name: 'ArguLab.' })).toBeVisible();
  await expect(flagship).toContainText('Illustrative workflow');
  await expect(flagship.getByRole('link', { name: 'Explore case study' })).toHaveAttribute(
    'href',
    '/projects/argulab',
  );
  await expect(page.locator('.work-truth-card')).toContainText('local document-QA prototype');
  await expect(page.locator('.work-voice-card')).toContainText(
    'The web app serves a CNN baseline.',
  );
  const ingestion = page
    .locator('.career-project')
    .filter({ hasText: 'Agentic Data Ingestion Platform' });
  await ingestion.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(ingestion).toHaveAttribute('open', '');
  await expect(ingestion.locator('.career-route')).toContainText('Unity Catalog');
  await ingestion.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(ingestion).not.toHaveAttribute('open', '');
  await expect(page.locator('.career-role-line').first()).toContainText('AI & Data Engineer');
  await expect(page.locator('.career-previous')).toContainText('January — May 2026');
  await page.locator('.bio-link').click();
  await expect(page).toHaveURL(/#skills$/);
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
