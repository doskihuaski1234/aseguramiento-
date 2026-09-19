import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth'; 

test.describe('Tarea 08 - Suite de inventario con hooks', () => {

  // Ejecutar las pruebas de forma paralela
  test.describe.configure({ mode: 'parallel' });

  // Login automático antes de cada prueba
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');

    // Verificar que el usuario llegó correctamente al inventario
    await expect(page).toHaveURL(/inventory/);
  });

  test('T08-01 - Verificar que se muestra el inventario', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('T08-02 - Verificar que existen productos', async ({ page }) => {
    const productos = page.locator('.inventory_item');

    await expect(productos.first()).toBeVisible();
    await expect(productos).not.toHaveCount(0);
  });

  test('T08-03 - Verificar nombre de los productos', async ({ page }) => {
    const nombres = page.locator('.inventory_item_name');

    await expect(nombres.first()).toBeVisible();
    await expect(nombres).not.toHaveCount(0);
  });

  test('T08-04 - Verificar precios de los productos', async ({ page }) => {
    const precios = page.locator('.inventory_item_price');

    await expect(precios.first()).toBeVisible();
    await expect(precios).not.toHaveCount(0);
  });

  test('T08-05 - Agregar un producto al carrito', async ({ page }) => {
    const botonAgregar = page.locator(
      '.inventory_item button'
    ).first();

    await botonAgregar.click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('T08-06 - Verificar navegación al carrito', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.cart_list')).toBeVisible();
  });

  test('T08-07 - Verificar menú de navegación', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();

    await expect(page.locator('.bm-menu')).toBeVisible();
  });

  test('T08-08 - Cerrar sesión', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();

    await page.locator('#logout_sidebar_link').click();

    await expect(page).toHaveURL(/\/$/);
  });

});