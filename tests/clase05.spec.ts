import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('Tarea Clase 05 - Retos de assertions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // ========== RETO 1 — toHaveValue() ==========
  test('Reto 1 - toHaveValue(): ordenar por precio y verificar value + primer precio', async ({ page }) => {
    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Ordenar por precio (low to high)
    const sortSelect = page.locator('[data-test="product-sort-container"]');
    await sortSelect.selectOption('lohi');

    // Verificar el value seleccionado
    await expect(sortSelect).toHaveValue('lohi');

    // Verificar el nuevo primer precio (el más barato)
    const firstPrice = page.locator('.inventory_item_price').first();
    await expect(firstPrice).toHaveText('$7.99'); // Sauce Labs Onesie
  });

  // ========== RETO 2 — toBeFocused() ==========
  test('Reto 2 - toBeFocused(): hacer click en el campo usuario y verificar foco', async ({ page }) => {
    const usernameInput = page.locator('[data-test="username"]');
    await usernameInput.click();

    // Verificar que recibió el foco del teclado
    await expect(usernameInput).toBeFocused();
  });

  // ========== RETO 3 — toHaveCSS() ==========
  test('Reto 3 - toHaveCSS(): verificar estilo computado del botón Add to cart', async ({ page }) => {
    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Tomamos el primer botón "Add to cart"
    const addToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');

    // Verificar una propiedad CSS computada
    await expect(addToCartBtn).toHaveCSS('cursor', 'pointer');
  });
});
