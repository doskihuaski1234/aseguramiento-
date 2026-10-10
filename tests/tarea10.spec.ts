import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory/);
});

// ---------- Reto 1: tags múltiples (+ --grep-invert) ----------
test('Reto 1a: el inventario muestra productos', { tag: ['@regression', '@ui'] }, async ({ page }) => {
  await expect(page.locator('[data-test="inventory-item"]').first()).toBeVisible();
});

test('Reto 1b: el carrito inicia vacío', { tag: ['@regression'] }, async ({ page }) => {
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
});

// ---------- Reto 2: expect.soft() ----------
test('Reto 2: verificar varios atributos del producto sin detenerse', async ({ page }, testInfo) => {
  const item = page.locator('[data-test="inventory-item"]').first();

  await expect.soft(item.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  await expect.soft(item.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
  await expect.soft(item.locator('[data-test="inventory-item-desc"]')).not.toBeEmpty();
  await expect.soft(item.locator('img')).toBeVisible();
  await expect.soft(item.getByRole('button', { name: 'Add to cart' })).toBeEnabled();

  // testInfo.errors reúne todos los fallos soft acumulados
  console.log(`Errores soft acumulados: ${testInfo.errors.length} - tarea10.spec.ts:31`);
  testInfo.errors.forEach((e, i) => console.log(`${i + 1}. ${e.message?.split('\n')[0]} - tarea10.spec.ts:32`));
});

// ---------- Reto 3: fixture browserName ----------
test('Reto 3: aserción ajustada según el motor del navegador', async ({ page, browserName }) => {
  const userAgent = await page.evaluate(() => navigator.userAgent);

  const esperado = {
    chromium: /Chrome\//,
    firefox: /Firefox\//,
    webkit: /Safari\//,
  }[browserName];

  expect(userAgent).toMatch(esperado);
  console.log(`Motor: ${browserName} > ${userAgent} - tarea10.spec.ts:46`);
});