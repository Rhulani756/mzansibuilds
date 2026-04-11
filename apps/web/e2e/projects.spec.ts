import { test, expect } from '@playwright/test';

test.describe('Project Creation Flow', () => {

  test('successfully fills and submits the new project form', async ({ page }) => {
    // 1. Intercept the API to prevent spamming your real database during tests
    await page.route('/api/projects', async (route) => {
      // Verify the frontend is sending the correct new fields
      const payload = route.request().postDataJSON();
      expect(payload.stage).toBe('PROTOTYPING');
      expect(payload.supportRequired).toBe('Looking for code review.');

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        json: { success: true, message: 'Project created successfully' },
      });
    });

    // 2. Navigate to the page
    await page.goto('/projects/new');

    // 3. Fill standard inputs
    await page.getByLabel(/Project Name/i).fill('MzansiBuilds Analytics');
    await page.getByLabel(/Description/i).fill('A dashboard for tracking project milestones over time.');
    
    // 4. Fill the newly added fields
    await page.getByLabel(/Current Stage/i).selectOption('PROTOTYPING');
    await page.getByLabel(/Support Required/i).fill('Looking for code review.');

    // 5. Submit form
    await page.getByRole('button', { name: 'Publish Project' }).click();

    // 6. Assert loading state and redirect
    //await expect(page.getByRole('button', { name: /Launching/i })).toBeVisible();
    await page.waitForURL('**/');
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('form validation prevents submission with missing required fields', async ({ page }) => {
    await page.goto('/projects/new');
    
    // Try to submit immediately without filling the title or description
    await page.getByRole('button', { name: 'Publish Project' }).click();
    
    // Check HTML5 validation on the Title input
    const titleInput = page.getByLabel(/Project Name/i);
    const isValid = await titleInput.evaluate((node: HTMLInputElement) => node.checkValidity());
    
    expect(isValid).toBe(false);
  });
});