import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Crear la carpeta de evidencias si no existe
test.beforeAll(async () => {
  if (!fs.existsSync('evidencias')) {
    fs.mkdirSync('evidencias', { recursive: true });
  }
});

test.describe('Pruebas de la Clase 02 - Navegación y Esperas en Demoblaze', () => {

  test('Navegar al carrito y regresar al inicio', async ({ page }) => {

    await page.goto('https://www.demoblaze.com/', {
      waitUntil: 'domcontentloaded'
    });

    await expect(page).toHaveURL(/demoblaze/);

    await page.screenshot({
      path: 'evidencias/01-pagina-inicio.png',
      fullPage: true
    });

    await page.getByRole('link', { name: 'Cart' }).click();

    await page.waitForURL('**/cart.html');

    await expect(page).toHaveURL(/cart/);

    await page.screenshot({
      path: 'evidencias/02-carrito-vacio.png',
      fullPage: true
    });

    await page.goBack();

    await expect(page).toHaveURL(/demoblaze\.com\/?$/);
  });

  test('Navegar a la categoría Phones y ver un producto', async ({ page }) => {

    await page.goto('https://www.demoblaze.com/', {
      waitUntil: 'domcontentloaded'
    });

    await page.getByRole('link', { name: 'Phones' }).click();

    const productos = page.locator('.card-title a');

    await expect(productos.first()).toBeVisible();

    expect(await productos.count()).toBeGreaterThan(0);

    await productos.first().click();

    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'evidencias/03-detalle-producto.png',
      fullPage: true
    });

    await expect(
      page.getByRole('link', { name: 'Add to cart' })
    ).toBeVisible();
  });

  test('Capturar el navbar y el footer por separado', async ({ page }) => {

    await page.goto('https://www.demoblaze.com/', {
      waitUntil: 'domcontentloaded'
    });

    const navbar = page.locator('#navbarExample');

    await expect(navbar).toBeVisible();

    await navbar.screenshot({
      path: 'evidencias/04-navbar.png'
    });

    const footer = page.locator('.container-fluid').last();

    await expect(footer).toBeVisible();

    await footer.screenshot({
      path: 'evidencias/05-footer.png'
    });
  });

  test('Verificar tiempo de carga de la página', async ({ page }) => {

    const inicio = Date.now();

    await page.goto('https://www.demoblaze.com/', {
      waitUntil: 'load'
    });

    const tiempoCarga = Date.now() - inicio;

    console.log(`Tiempo de carga: ${tiempoCarga} ms - clase02.spec.ts:103`);

    expect(tiempoCarga).toBeLessThan(10000);
  });

});