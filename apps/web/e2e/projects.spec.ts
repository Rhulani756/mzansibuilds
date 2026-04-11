import { test, expect } from '@playwright/test';

test.describe('Project Creation Flow', () => {

  // This runs BEFORE every single test in this block
  test.beforeEach(async ({ page }) => {
    // 1. Go to the login page
    await page.goto('/login');
    
    // 2. Log in using standard credentials
    // IMPORTANT: Make sure this user actually exists in your local Supabase database!
    // You can register it manually through your app once if you haven't already.
    await page.locator('input[name="email"]').fill('test@example.com'); 
    await page.locator('input[name="password"]').fill('password123'); 
    await page.locator('button:has-text("Log In")').click();

    // 3. Wait for the redirect to the dashboard to confirm the auth cookie is set
    await page.waitForURL('**/dashboard*');
  });

  test('successfully fills and submits the new project form', async ({ page }) => {
    // 1. Intercept the API to prevent spamming your real database during tests
    await page.route('/api/projects', async (route) => {
      const payload = route.request().postDataJSON();
      expect(payload.stage).toBe('PROTOTYPING');
      expect(payload.supportRequired).toBe('Looking for code review.');

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        json: { success: true, message: 'Project created successfully' },
      });
    });

    // 2. Navigate to the page (Now it will work because the bot has an auth cookie!)
    await page.goto('/projects/new');

    // 3. Fill standard inputs
    await page.getByLabel(/Project Name/i).fill('MzansiBuilds Analytics');
    await page.getByLabel(/Description/i).fill('A dashboard for tracking project milestones over time.');
    
    // 4. Fill the newly added fields
    await page.getByLabel(/Current Stage/i).selectOption('PROTOTYPING');
    await page.getByLabel(/Support Required/i).fill('Looking for code review.');

    // 5. Submit form
    await page.getByRole('button', { name: 'Publish Project' }).click();

    // 6. Assert redirect goes to the dashboard because the user IS authenticated
    await page.waitForURL('**/dashboard?message=*');
    expect(page.url()).toContain('message=Project%20Created%20Successfully');
  });

  test('form validation prevents submission with missing required fields', async ({ page }) => {
    // The bot is already logged in here due to beforeEach
    await page.goto('/projects/new');
    
    await page.getByRole('button', { name: 'Publish Project' }).click();
    
    const titleInput = page.getByLabel(/Project Name/i);
    const isValid = await titleInput.evaluate((node: HTMLInputElement) => node.checkValidity());
    
    expect(isValid).toBe(false);
  });
});