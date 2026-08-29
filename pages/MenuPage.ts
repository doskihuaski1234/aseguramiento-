import { Page, Locator, expect } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly menuSidebar: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.menuSidebar = page.locator('.bm-menu-wrap');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async closeMenu() {
    await this.closeMenuButton.click();
  }

  async expectMenuVisible() {
    await expect(this.menuSidebar).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async logoutFlow() {
    await this.openMenu();
    await this.expectMenuVisible();
    await this.logout();

    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }
}