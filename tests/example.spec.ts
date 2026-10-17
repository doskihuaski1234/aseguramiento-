import { test, expect } from '@playwright/test';

test('La página de login de SauceDemo carga correctamente', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Swag Labs/);
  await expect(page.locator('.login_logo')).toBeVisible();
  await expect(page.locator('#user-name')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('#login-button')).toBeVisible();
});
