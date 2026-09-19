import { Page, expect } from '@playwright/test';

/**
 * Inicia sesión en SauceDemo con un usuario específico.
 * @param page Instancia de la página de Playwright.
 * @param username Nombre de usuario a autenticar.
 */
export async function loginAs(page: Page, username: string): Promise<void> {
  const passwords: Record<string, string> = {
    standard_user: 'secret_sauce',
    problem_user: 'secret_sauce',
    performance_glitch_user: 'secret_sauce',
    locked_out_user: 'secret_sauce',
    error_user: 'secret_sauce',
    visual_user: 'secret_sauce',
  };

  // Navegar a la página principal
  await page.goto('https://www.saucedemo.com/');

  // Completar credenciales y enviar formulario
  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(passwords[username] ?? 'secret_sauce');
  await page.locator('#login-button').click();
}