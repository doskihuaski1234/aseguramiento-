import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:9323');
await page.waitForTimeout(1500);
await page.screenshot({ path: 'reporte-html.png', fullPage: true });
await browser.close();
console.log('Captura guardada: reporte-html.png');
