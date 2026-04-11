import { test, expect } from '@playwright/test';

test.describe('Project Creation Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    // Using your standard test credentials
    await page.locator('input[name="email"]').fill('test@example.com'); 
    await page.locator('input[name="password"]').fill('password123'); 
    await page.locator('button:has-text("Log In")').click();

    // Confirm we are in
    await page.waitForURL('**/dashboard*');
  });

  test('successfully creates a project and redirects to dashboard', async ({ page }) => {
    await page.goto('/projects/new');

    const uniqueTitle = `Analytics Tool ${Date.now()}`;

    // Fill the form
    await page.getByLabel(/Project Name/i).fill(uniqueTitle);
    await page.getByLabel(/Description/i).fill('Testing the real database integration.');
    
    // Match these to your Stage enum exactly
    await page.getByLabel(/Current Stage/i).selectOption('PROTOTYPING');
    await page.getByLabel(/Support Required/i).fill('Looking for code review.');

    // Trigger the Server Action
    await page.getByRole('button', { name: /Publish Project/i }).click();

    // Verify redirect with the success message in the URL
    await page.waitForURL(url => url.searchParams.has('message'));
    expect(page.url()).toContain('Project%20Created%20Successfully');

    // FINAL BOSS CHECK: Verify it actually appears on the Dashboard UI
    await expect(page.locator('h3')).toContainText(uniqueTitle);
  });

  test('form validation prevents submission with missing required fields', async ({ page }) => {
    await page.goto('/projects/new');
    
    // Try to submit empty
    await page.getByRole('button', { name: /Publish Project/i }).click();
    
    // Check browser-native validation on the title input
    const titleInput = page.getByLabel(/Project Name/i);
    const isValid = await titleInput.evaluate((node: HTMLInputElement) => node.checkValidity());
    
    expect(isValid).toBe(false);
  });
});