import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';

test.describe('Tarea Clase 11 - Documentación de defectos', () => {
  test.afterEach(async ({ page }, testInfo) => {
    const tieneErrores =
      testInfo.status === 'failed' ||
      testInfo.status === 'timedOut';

    if (!tieneErrores) return;

    const resultado = testInfo.errors
      .map((error) => error.message)
      .join('\n\n');

    const reporte = [
      '# Borrador de reporte de defecto',
      '',
      `- **Título:** ${testInfo.title}`,
      `- **Ambiente:** Firefox / Playwright`,
      `- **URL:** ${page.url() || BASE_URL}`,
      `- **Resultado esperado:** La prueba debe completarse correctamente.`,
      `- **Resultado obtenido:** ${resultado || testInfo.status}`,
      `- **Estado:** ${testInfo.status}`,
      `- **Fecha:** ${new Date().toISOString()}`,
      '',
    ].join('\n');

    await testInfo.attach('borrador-reporte-defecto.md', {
      body: Buffer.from(reporte, 'utf-8'),
      contentType: 'text/markdown',
    });
  });

  test('Reto 1: medir la frecuencia del defecto de texto', async ({
    page,
  }, testInfo) => {
    const intentos = 12;
    let apariciones = 0;
    const resultados: string[] = [];

    for (let i = 1; i <= intentos; i++) {
      await page.goto(`${BASE_URL}/typos`, {
        waitUntil: 'domcontentloaded',
      });

      const texto = await page.locator('body').innerText();

      // El defecto conocido de esta página consiste en la palabra
      // "wont" sin apóstrofo, en lugar de "won't".
      const defectoDetectado = /\bwont\b/i.test(texto);

      if (defectoDetectado) {
        apariciones++;
      }

      resultados.push(
        `Intento ${i}: ${defectoDetectado ? 'defecto detectado' : 'defecto no detectado'}`,
      );
    }

    const frecuencia = {
      url: `${BASE_URL}/typos`,
      totalIntentos: intentos,
      aparicionesDelDefecto: apariciones,
      frecuenciaPorcentual: Number(
        ((apariciones / intentos) * 100).toFixed(2),
      ),
      resultados,
    };

    testInfo.annotations.push({
      type: 'defect-frequency',
      description: `${apariciones}/${intentos} apariciones (${frecuencia.frecuenciaPorcentual} %)`,
    });

    await testInfo.attach('frecuencia-defecto-typos.json', {
      body: Buffer.from(JSON.stringify(frecuencia, null, 2), 'utf-8'),
      contentType: 'application/json',
    });

    await testInfo.attach('frecuencia-defecto-typos.txt', {
      body: Buffer.from(
        [
          'MEDICIÓN DEL DEFECTO INTERMITENTE',
          `URL: ${frecuencia.url}`,
          `Recargas: ${intentos}`,
          `Apariciones: ${apariciones}`,
          `Frecuencia: ${frecuencia.frecuenciaPorcentual}%`,
          '',
          ...resultados,
        ].join('\n'),
        'utf-8',
      ),
      contentType: 'text/plain',
    });

    expect(apariciones).toBeGreaterThanOrEqual(0);
    expect(apariciones).toBeLessThanOrEqual(intentos);
  });

  test('Reto 2: texto sin errores cuando se resuelva el issue', async ({
    page,
  }) => {
    test.fixme(
      true,
      'ISSUE-001: defecto de texto pendiente de corrección en /typos.',
    );

    test.info().annotations.push({
      type: 'issue',
      description: 'ISSUE-001: https://practice.expandtesting.com/typos',
    });

    await page.goto(`${BASE_URL}/typos`);

    const texto = await page.locator('body').innerText();

    expect(texto).not.toMatch(/\bwont\b/i);
  });

  test('Reto 3: documentar las imágenes de /broken-images', async ({
    page,
  }, testInfo) => {
    await page.goto(`${BASE_URL}/broken-images`, {
      waitUntil: 'domcontentloaded',
    });

    const imagenes = await page.locator('img').evaluateAll((elements) =>
      elements.map((element) => {
        const img = element as HTMLImageElement;

        return {
          src: img.src,
          cargada: img.complete && img.naturalWidth > 0,
          naturalWidth: img.naturalWidth,
        };
      }),
    );

    const rotas = imagenes.filter((imagen) => !imagen.cargada);

    testInfo.annotations.push({
      type: 'image-audit',
      description: `${rotas.length} imágenes sin cargar de ${imagenes.length} inspeccionadas.`,
    });

    await testInfo.attach('resultado-broken-images.json', {
      body: Buffer.from(
        JSON.stringify(
          {
            url: page.url(),
            totalImagenes: imagenes.length,
            imagenesRotas: rotas.length,
            detalle: imagenes,
          },
          null,
          2,
        ),
        'utf-8',
      ),
      contentType: 'application/json',
    });

    // La prueba documenta las imágenes rotas; no falla por un
    // defecto conocido que precisamente se está investigando.
    await expect(page.locator('body')).toBeVisible();
  });
});
