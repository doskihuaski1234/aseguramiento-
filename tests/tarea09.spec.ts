import { test as base, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

// ========== RETO 1: Fixture con teardown real (cronómetro) ==========
type TimerFixtures = {
  timer: void;
};

const testWithTimer = base.extend<TimerFixtures>({
  timer: [async ({}, use, testInfo) => {
    const start = Date.now();
    console.log(`⏱️  Inicio del test: ${testInfo.title}`);

    await use(); // aquí corre el test

    // Teardown: se ejecuta SIEMPRE (pase o falle el test)
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`⏱️  Test "${testInfo.title}" terminó en ${duration} segundos`);
  }, { auto: true }],
});

// ========== RETO 2: Fixture de alcance worker ==========
type WorkerFixtures = {
  counter: { value: number };
};

const testWithWorker = base.extend<{}, WorkerFixtures>({
  counter: [async ({}, use) => {
    const state = { value: 0 };
    await use(state);
  }, { scope: 'worker' }],
});

// ========== RETO 3: test.use() + parametrización de viewports ==========
const viewports = [
  { name: 'móvil', width: 375, height: 667 },
  { name: 'escritorio', width: 1280, height: 720 },
];

// ---------- Tests usando los fixtures ----------

testWithTimer('Reto 1 - Fixture con teardown real (cronómetro)', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/Swag Labs/);
  // Descomenta la siguiente línea para forzar fallo y ver que el teardown igual corre:
  // expect(true).toBe(false);
});

testWithWorker.describe('Reto 2 - Fixture scope worker', () => {
  testWithWorker('primer test - contador debe ser 1', async ({ counter }) => {
    counter.value += 1;
    expect(counter.value).toBe(1);
    console.log(`Contador en test 1: ${counter.value}`);
  });

  testWithWorker('segundo test - contador debe ser 2 (persiste entre tests del mismo worker)', async ({ counter }) => {
    counter.value += 1;
    expect(counter.value).toBe(2);
    console.log(`Contador en test 2: ${counter.value}`);
  });
});

// Reto 3: mismo test en dos viewports
for (const vp of viewports) {
  test.describe(`Viewport ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`Reto 3 - Login se ve correctamente en ${vp.name}`, async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
      console.log(`Ejecutado en ${vp.name} (${vp.width}x${vp.height})`);
    });
  });
}
