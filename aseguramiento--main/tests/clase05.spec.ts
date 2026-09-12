import { test, expect } from '@playwright/test';
test('CE válida: login con credenciales correctas',
  async ({ page }) => {

    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Aserción: debemos llegar al Inventario
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_container'))
      .toBeVisible();

    console.log('CE válida: login exitoso - clase05.spec.ts:16');
  }
);

test('CE inválida: usuario bloqueado', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('locked out');

  console.log('CE usuario bloqueado: mensaje correcto mostrado - clase05.spec.ts:32');
});

test('Valor en frontera: campos vacíos (frontera de longitud mínima)', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  // No llenar ningún campo
  await page.locator('#login-button').click();

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('Username is required');

  console.log('Valor frontera: campo vacío maneja error correctamente - clase05.spec.ts:46');
});

test('Verificar que el Inventario tiene exactamente 6 productos', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory/);

  // Contar productos y verificar cantidad exacta
  const productos = page.locator('.inventory_item');
  await expect(productos).toHaveCount(6);

  console.log('El inventario tiene exactamente 6 productos - clase05.spec.ts:63');
});

// tests/clase05.spec.ts

test('Verificar precio del primer producto con regex', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory/);

  const textoPrecio = await page.locator('.inventory_item_price')
    .first().textContent();

  // El regex valida el formato $XX.XX (p.ej. $29.99)
  expect(textoPrecio?.trim()).toMatch(/^\$\d+\.\d{2}$/);
});

// tests/clase05.spec.ts

test('Verificar atributos y estados de los elementos del inventario', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory/);

  const primerBoton = page.locator('.btn_inventory').first();
  await expect(primerBoton).toBeEnabled();
  await expect(primerBoton).toHaveText('Add to cart');

  // (continuación) click y verificar que cambió a 'Remove'
  await primerBoton.click();
  await expect(primerBoton).toHaveText('Remove');

  // Verificar que el carrito muestra 1 item
  const badgeCarrito = page.locator('.shopping_cart_badge');
  await expect(badgeCarrito).toBeVisible();
  await expect(badgeCarrito).toHaveText('1');

  console.log('El botón cambia de estado y el carrito se actualiza - clase05.spec.ts:104');
});