import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth'; // Usar ./ en lugar de ../

// SUITE PRINCIPAL: Inventario y Navegación
test.describe('Clase 08 - Suite de inventario con hooks', () => {
  test.describe.configure({ mode: 'parallel' });

  // Antes de cada test de esta suite: login automático
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    // Verificar que llegamos al inventario
    await expect(page).toHaveURL(/inventory/);
  });

  // Después de cada test: si falla, generar evidencia
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const nombreSeguro = testInfo.title
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      try {
        await page.screenshot({
          path: `./evidencias/fallo-${nombreSeguro}.png`,
          fullPage: true
        });
        console.log(`Test fallido: ${testInfo.title}  Screenshot guardado - clase08.spec.ts:26`);
      } catch (e) {
        // Si la página se cerró antes del afterEach, el screenshot fallará
        console.log('No se pudo capturar screenshot: - clase08.spec.ts:29', e);
      }
    }
  });

  test('El inventario muestra 6 productos', async ({ page }) => {
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);
  });

  test('Todos los productos tienen precio visible', async ({ page }) => {
    const precios = page.locator('.inventory_item_price');
    const cantidad = await precios.count();

    for (let i = 0; i < cantidad; i++) {
      const precio = precios.nth(i);
      await expect(precio).toBeVisible();
      const textoPrecio = await precio.textContent();
      expect(textoPrecio).toMatch(/^\$\d+\.\d{2}$/); // formato: $9.99
    }

    console.log(`Todos los ${cantidad} productos tienen precio en formato correcto - clase08.spec.ts:50`);
  });

  test('Todos los productos tienen imagen visible', async ({ page }) => {
    const imagenes = page.locator('.inventory_item img');
    const cantidad = await imagenes.count();

    for (let i = 0; i < cantidad; i++) {
      await expect(imagenes.nth(i)).toBeVisible();
      const src = await imagenes.nth(i).getAttribute('src');
      expect(src).not.toBeNull();
    }

    console.log(`${cantidad} imágenes verificadas - clase08.spec.ts:63`);
  });

  test('El menú de hamburguesa funciona', async ({ page }) => {
    // Abrir menú
    await page.locator('#react-burger-menu-btn').click();
    await page.waitForSelector('.bm-menu', { state: 'visible' });

    // Verificar opciones
    await expect(page.getByText('All Items')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
    await expect(page.getByText('Reset App State')).toBeVisible();

    // Cerrar menú
    await page.locator('#react-burger-cross-btn').click();
    await page.waitForSelector('.bm-menu', { state: 'hidden' });
  });  

  test('Logout funciona correctamente', async ({ page }) => {
    // Abrir menú y hacer logout
    await page.locator('#react-burger-menu-btn').click();
    await page.getByText('Logout').click();

    // Verificar que redirige al login
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();
  });
});

// SUITE SEPARADA: Comportamiento por tipo de usuario
test.describe('Clase 08 - Comportamiento por tipo de usuario', () => {
  test.describe.configure({ mode: 'parallel' });

  test('Usuario estándar puede completar el checkout', async ({ page }) => {
    await loginAs(page, 'standard_user');

    await page.locator('.btn_inventory').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one/);
    console.log('Usuario estándar llegó al checkout - clase08.spec.ts:105');
  });

  test('Usuario de rendimiento degradado experimenta lentitud', async ({ page }) => {
    const inicio = Date.now();
    await loginAs(page, 'performance_glitch_user');
    const tiempoLogin = Date.now() - inicio;

    console.log(`Tiempo de login (glitch user): ${tiempoLogin}ms - clase08.spec.ts:113`);

    expect(tiempoLogin).toBeGreaterThan(0);
    await expect(page).toHaveURL(/inventory/);
  });
});