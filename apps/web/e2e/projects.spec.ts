import { test, expect } from '@playwright/test';

test.describe('Project Creation Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials - ensuring we use locators that wait for visibility
    await page.locator('input[name="email"]').fill('test@example.com'); 
    await page.locator('input[name="password"]').fill('password123'); 
    await page.getByRole('button', { name: /Log In/i }).click();

    // Ensure we are fully loaded on the dashboard before starting
    await page.waitForURL('**/dashboard*');
    await expect(page.getByRole('heading', { name: /My Workspace/i })).toBeVisible();
  });

  test('owner can successfully post a project milestone', async ({ page }) => {
    // 1. Go to the dashboard
    await page.goto('/dashboard');

    // 2. Click the new management link (Use regex to ignore the arrow icon)
    await page.getByRole('link', { name: /Manage Updates/i }).first().click();

    // 3. Fill the Milestone form using the new placeholder text
    const milestoneUpdate = `Milestone Achievement: Completed UI Refactor at ${Date.now()}`;
    await page.getByPlaceholder(/What did you achieve today/i).fill(milestoneUpdate);
    
    // 4. Click the new publish button
    await page.getByRole('button', { name: /Publish Update/i }).click();

    // 5. Verification: Check that it appears in the "Update History" list
    await expect(page.getByText(milestoneUpdate)).toBeVisible({ timeout: 10000 });
});

  test('successfully creates a project and verifies it on the dashboard', async ({ page }) => {
    await page.goto('/projects/new');

    const uniqueTitle = `Mzansi Analytics ${Date.now()}`;

    // Use labels to find inputs - much more resilient than IDs or Names
    await page.getByLabel(/Project Name/i).fill(uniqueTitle);
    await page.getByLabel(/Description/i).fill('Automation test for Derivco challenge.');
    await page.getByLabel(/Current Stage/i).selectOption('PROTOTYPING');
    await page.getByLabel(/Support Required/i).fill('Looking for QA feedback.');

    // Submit
    await page.getByRole('button', { name: /Publish Project/i }).click();

    // 1. Wait for the redirect and the success message in the URL
    await page.waitForURL(url => url.searchParams.has('message'));
    expect(page.url()).toContain('Project%20Created%20Successfully');

    // 2. THE CRITICAL CHECK: Wait for the specific title to appear
    // Using getByRole('heading') is much safer than locator('h3')
    const projectHeading = page.getByRole('heading', { name: uniqueTitle });
    await expect(projectHeading).toBeVisible({ timeout: 10000 });
  });

  test('form validation prevents submission with missing required fields', async ({ page }) => {
    await page.goto('/projects/new');
    
    await page.getByRole('button', { name: /Publish Project/i }).click();
    
    // Check browser-native validation
    const titleInput = page.getByLabel(/Project Name/i);
    const isValid = await titleInput.evaluate((node: HTMLInputElement) => node.checkValidity());
    
    expect(isValid).toBe(false);
  });
});

