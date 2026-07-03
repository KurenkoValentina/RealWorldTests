export class RegisterPage {
  constructor(page) {
    // это браузер
    this.page = page;
    // здесь мы описываем техническую реализацию страницы
    // здесь все про элементы

    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.yournameInput = page.getByRole('textbox', { name: 'Your Name' });

    this.signupButton = page.getByRole('button', { name: 'Sign up' });
  }

  // Бизнес-сценарии на страничке
  async signup(username, email, password) {
    await this.yournameInput.click();
    await this.yournameInput.fill(username);
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.signupButton.click();
  }
}
