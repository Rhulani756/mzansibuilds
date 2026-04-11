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

test('completing a project automatically adds it to the Celebration Wall', async ({ page }) => {
    // 1. Create a unique test project
    const uniqueTitle = `Gold Medal Build ${Date.now()}`;
    await page.goto('/projects/new');
    await page.getByLabel(/Project Name/i).fill(uniqueTitle);
    await page.getByLabel(/Description/i).fill('Destined for the Celebration Wall.');
    await page.getByLabel(/Current Stage/i).selectOption('DEVELOPMENT');
    await page.getByRole('button', { name: /Publish Project/i }).click();
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard*');

    // 2. Navigate to the Command Center for THIS specific project
    // We filter the project cards to find the one with our unique title, then click its specific link
    const projectCard = page.locator('.bg-white.rounded-xl', { hasText: uniqueTitle });
    await projectCard.getByRole('link', { name: /Manage Updates/i }).click();

    await page.locator('select[name="stage"]').selectOption('COMPLETED');
    
    // Use Promise.all to click the button AND wait for the background request to finish
    await Promise.all([
      page.waitForResponse(response => response.request().method() === 'POST'),
      page.getByRole('button', { name: /Update Stage/i }).click()
    ]);

    // 4. Navigate to the Celebration Wall
    await page.goto('/wall');

    // 4. Navigate to the Celebration Wall
    // You can also use page.getByRole('link', { name: /Celebration Wall/i }).click() if you prefer clicking the nav!
    await page.goto('/wall');

    // 5. THE FINAL CHECK: Verify our project made it to the Hall of Fame
    const winningProject = page.getByRole('heading', { name: uniqueTitle });
    
    // We give it a generous timeout just in case Next.js caching takes a second to revalidate
    await expect(winningProject).toBeVisible({ timeout: 10000 });
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

