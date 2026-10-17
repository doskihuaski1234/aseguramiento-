import { test, expect } from '@playwright/test';

test.describe('Clase 01 - Validaciones iniciales de SauceDemo', () => {
  test('La página de inicio carga correctamente', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('El inventario muestra sus productos', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('La navegación al carrito está disponible', async ({ page }) => {
    await page.goto('/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
