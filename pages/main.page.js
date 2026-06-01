export class MainPage {
  constructor(page) {
    // это браузер
    this.page = page;
    // здесь мы описываем техническую реализацию страницы
    // здесь все про элементы
    this.signupButton = page.getByRole('link', { name: 'Sign up' });
    this.loginButton = page.getByRole('link', { name: 'Login' });
    this.dropdownMenu = page.locator('div.nav-link.dropdown-toggle.cursor-pointer');
    this.dropdownProfile = page.locator('a.dropdown-item').filter({ hasText: 'Profile' });
    this.settingsButton = page.locator('a.dropdown-item').filter({ hasText: 'Settings' });
    this.dropdownLogout = page.locator('a.dropdown-item').filter({ hasText: 'Logout' });
  }

  // Бизнес-сценарии на страничке
  async gotoRegister() {
    await this.signupButton.click();
  }
  async gotoSettings() {
    await this.dropdownMenu.click();
    await this.settingsButton.click();
  }

  async gotologin() {
    await this.loginButton.click();
  }

  async gotoprofile() {
    await this.dropdownProfile.click();
  }

  async gotologout() {
    await this.dropdownMenu.click();
    await this.dropdownLogout.waitFor({ state: 'visible' }); //ждем видимость
    await this.dropdownLogout.click();
  }
}
