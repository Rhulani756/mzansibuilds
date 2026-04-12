import { test, expect } from '@playwright/test';

test.describe('Authenticated Project Flows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials - ensuring we use locators that wait for visibility
    await page.locator('input[name="email"]').fill('test@example.com'); 
    await page.locator('input[name="password"]').fill('password123'); 
    await page.getByRole('button', { name: /Log In/i }).click();

    // Ensure we are fully loaded on the dashboard before starting
    await page.waitForURL('**/dashboard*');
    await expect(page.getByRole('heading', { name: /My Workspace/i })).toBeVisible({ timeout: 20000 });
  });

  test('owner can successfully post a project milestone', async ({ page }) => {
    // 1. SETUP: Create a quick project so we actually have something to manage
    const targetTitle = `Milestone Target ${Date.now()}`;
    await page.goto('/projects/new');
    await page.getByLabel(/Project Name/i).fill(targetTitle);
    await page.getByLabel(/Description/i).fill('Testing the milestone flow.');
    await page.getByRole('button', { name: /Publish Project/i }).click();
    await page.waitForURL('**/dashboard*');

    // 2. Navigate to the Command Center for THIS specific project
    const projectCard = page.locator('.bg-white.rounded-xl', { hasText: targetTitle });
    await projectCard.getByRole('link', { name: /Manage Updates/i }).click();

    // 3. Fill the Milestone form
    const milestoneUpdate = `Milestone Achievement: Completed UI Refactor at ${Date.now()}`;
    await page.getByPlaceholder(/What did you achieve today/i).fill(milestoneUpdate);
    
    // 4. Click the publish button AND wait for the server
    await Promise.all([
      page.waitForResponse(response => response.request().method() === 'POST'),
      page.getByRole('button', { name: /Publish Update/i }).click()
    ]);

    // 5. Verification
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
    const projectCard = page.locator('.bg-white.rounded-xl', { hasText: uniqueTitle });
    await projectCard.getByRole('link', { name: /Manage Updates/i }).click();

    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();

    await page.getByRole('combobox').selectOption('COMPLETED');
    
    // Use Promise.all to click the button AND wait for the background request to finish
    await Promise.all([
      page.waitForResponse(response => response.request().method() === 'POST'),
      page.getByRole('button', { name: /Update Stage/i }).click()
    ]);

    // 4. Navigate to the Celebration Wall
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
    expect(page.url()).toContain('Project+Created+Successfully');

    // 2. THE CRITICAL CHECK: Wait for the specific title to appear
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

  test('user identity is correctly displayed when posting a comment', async ({ page }) => {
    // 1. 🚀 SETUP: Create a quick project so we GUARANTEE there is something in the feed
    const targetTitle = `Discussion Target ${Date.now()}`;
    await page.goto('/projects/new');
    await page.getByLabel(/Project Name/i).fill(targetTitle);
    await page.getByLabel(/Description/i).fill('Testing the discussion feed.');
    await page.getByRole('button', { name: /Publish Project/i }).click();
    await page.waitForURL('**/dashboard*');

    // 2. Setup known username
    const knownUsername = `qa_ninja_${Date.now()}`;
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: /Profile Settings/i })).toBeVisible({ timeout: 15000 });
    
    await page.locator('input[name="username"]').fill(knownUsername);
    await Promise.all([
      page.waitForResponse(response => response.request().method() === 'POST'),
      page.getByRole('button', { name: /Save Changes/i }).click()
    ]);

    // 3. Go to feed and find our SPECIFIC project
    await page.goto('/feed');
    
    // 🚀 FIX: Find the specific project we just created, guaranteeing it exists
    const projectCard = page.locator('div.bg-white.rounded-xl', { hasText: targetTitle });
    await projectCard.getByRole('link', { name: /View Project & Discuss/i }).click();

    // 4. Post a comment
    const uniqueComment = `Code review looks great! Timestamp: ${Date.now()}`;
    await page.getByPlaceholder(/Share your thoughts/i).fill(uniqueComment);
    
    await Promise.all([
      page.waitForResponse(response => response.request().method() === 'POST'),
      page.getByRole('button', { name: /Post Comment/i }).click()
    ]);

    // 5. Verify the tag
    const commentContainer = page.locator('div.flex-1.bg-gray-50', { hasText: uniqueComment });
    await expect(commentContainer.getByText(`@${knownUsername}`)).toBeVisible();
  });
});