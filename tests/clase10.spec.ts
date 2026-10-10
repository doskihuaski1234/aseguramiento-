import { test, expect } from '@playwright/test';

test.describe('Clase 10 - Smoke', () => {
  test('la página de login carga @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('login válido muestra el inventario @smoke', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
  });
});

test.describe('Clase 10 - Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('el inventario lista 6 productos @regression', async ({ page }) => {
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('agregar al carrito actualiza el contador @regression', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});