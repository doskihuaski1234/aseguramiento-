import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Tarea 07 - Tests Reto (evidencias avanzadas)', () => {

  // ─────────────────────────────────────────────
  // RETO 1 — test.step()
  // Cada paso aparece por separado en el reporte HTML y en el Trace Viewer
  // ─────────────────────────────────────────────
  test('Reto 1: Login con pasos nombrados (test.step)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await test.step('Navegar a la página de login', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/saucedemo\.com/);
    });

    await test.step('Realizar login con usuario válido', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('Verificar que estamos en el inventario', async () => {
      await inventoryPage.expectToBeOnInventoryPage();
      await expect(page.locator('.inventory_item')).toHaveCount(6);
    });
  });


  // ─────────────────────────────────────────────
  // RETO 2 — testInfo.attach()
  // Adjunta un archivo de texto con datos capturados al reporte HTML
  // ─────────────────────────────────────────────
  test('Reto 2: Adjuntar datos capturados al reporte (testInfo.attach)', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);

    // Capturar datos
    const cantidadProductos = await page.locator('.inventory_item').count();
    const urlActual = page.url();
    const fecha = new Date().toISOString();

    const contenido = [
      '=== Datos capturados - Reto 2 ===',
      `Cantidad de productos: ${cantidadProductos}`,
      `URL actual: ${urlActual}`,
      `Fecha de ejecución: ${fecha}`,
      `Usuario: standard_user`,
    ].join('\n');

    // Adjuntar al reporte HTML
    await testInfo.attach('datos-capturados.txt', {
      body: contenido,
      contentType: 'text/plain',
    });

    // También puedes adjuntar un screenshot si quieres
    await testInfo.attach('inventario.png', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // Verificación mínima
    expect(cantidadProductos).toBe(6);
  });


  // ─────────────────────────────────────────────
  // RETO 3 — toHaveScreenshot()
  // Comparación visual contra baseline.
  // Primera ejecución → genera el baseline.
  // Debes commitear la carpeta de snapshots al repo.
  // ─────────────────────────────────────────────
  test('Reto 3: Comparación visual (toHaveScreenshot)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);

    // Comparación visual de toda la página
    // Primera vez: genera el baseline automáticamente
    // Siguientes veces: compara contra el baseline
    await expect(page).toHaveScreenshot('inventario-completo.png', {
      fullPage: true,
      // Opcional: tolerancias
      // maxDiffPixels: 100,
      // threshold: 0.2,
    });

    // También puedes comparar un elemento concreto
    await expect(page.locator('.inventory_list')).toHaveScreenshot('lista-productos.png');
  });

});