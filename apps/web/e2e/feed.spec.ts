import { test, expect } from '@playwright/test';

test.describe('Live Feed Public Page', () => {
  
  test('loads the feed and renders either projects or the empty state', async ({ page }) => {
    // Navigate to the public feed
    await page.goto('/feed');

    // 1. Verify standard static headers render correctly
    await expect(page.locator('h1')).toContainText('Live Feed');
    await expect(page.getByText('Discover what the Mzansi community is building')).toBeVisible();

    // 2. Verify the Call to Action link is present and points to the right place
    const shareLink = page.getByRole('link', { name: '+ Share Your Project' });
    await expect(shareLink).toBeVisible();
    await expect(shareLink).toHaveAttribute('href', '/projects/new');

    // 3. Handle dynamic database content 
    // Playwright receives the fully rendered HTML from the Server Component.
    // We check if the server returned the empty state OR populated project cards.
    const hasEmptyState = await page.getByText("It's quiet here...").count() > 0;
    
    // We target the grid container that holds the project cards
    const hasProjects = await page.locator('.grid > div').count() > 0;

    // Ensure the server successfully connected to Prisma and returned valid HTML for one of the states
    expect(hasEmptyState || hasProjects).toBe(true);
  });

  test('respects middleware security when an unauthenticated user tries to share', async ({ page }) => {
    await page.goto('/feed');

    // The bot clicks the Share link while not logged in
    await page.getByRole('link', { name: '+ Share Your Project' }).click();

    // Verify your Next.js middleware security catches the unauthenticated bot
    // and bounces it away from the protected /projects/new route back to the home page
    await page.waitForURL('**/login');
    
    expect(page.url()).toContain('/login');
  });
});