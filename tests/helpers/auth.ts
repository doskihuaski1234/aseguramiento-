import { Page, expect } from '@playwright/test';

// Tipo helper para validar usuarios conocidos de SauceDemo
export type SauceUser = 
  | 'standard_user' 
  | 'locked_out_user' 
  | 'problem_user' 
  | 'performance_glitch_user' 
  | 'error_user' 
  | 'visual_user';

const PASSWORDS: Record<string, string> = {
  standard_user: 'secret_sauce',
  locked_out_user: 'secret_sauce',
  problem_user: 'secret_sauce',
  performance_glitch_user: 'secret_sauce',
  error_user: 'secret_sauce',
  visual_user: 'secret_sauce',
};

/**
 * Inicia sesión en SauceDemo con el usuario especificado.
 * @param page Instancia de Page provista por Playwright
 * @param username Nombre del usuario registrado en SauceDemo
 */
export async function loginAs(page: Page, username: SauceUser | string) {
  // 1. Navegar a SauceDemo si no estamos en la página
  if (!page.url().includes('saucedemo.com')) {
    await page.goto('https://www.saucedemo.com');
  }

  // 2. Asegurar que los inputs estén visibles antes de escribir
  const userInput = page.locator('#user-name');
  const passInput = page.locator('#password');
  const loginButton = page.locator('#login-button');

  await expect(userInput).toBeVisible();

  // 3. Completar credenciales y enviar formulario
  const password = PASSWORDS[username] ?? 'secret_sauce';

  await userInput.fill(username);
  await passInput.fill(password);
  await loginButton.click();
}