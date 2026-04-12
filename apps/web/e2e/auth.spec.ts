import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  
  test('unauthenticated user is redirected from dashboard to login page', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Expect to be kicked back to the login page (per our middleware logic)
    await expect(page).toHaveURL('/login');
  });

  test('navigation to login page works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start a Project');
    
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Welcome to MzansiBuilds');
  });

  test('login form validates email input', async ({ page }) => {
    await page.goto('/login');
    
    // Click login without filling fields
    await page.click('button:has-text("Log In")');
    
    // Check if the HTML5 validation popup is active (standard browser behavior)
    const emailInput = page.locator('input[name="email"]');
    const isValid = await emailInput.evaluate((node: HTMLInputElement) => node.checkValidity());
    expect(isValid).toBe(false);
  });
});