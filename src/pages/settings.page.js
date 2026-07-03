export class SettingsPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('Your Name');
    this.passwordInput = page.getByPlaceholder('Password');
    this.emailInput = page.getByPlaceholder('Email');
    this.settingsButton = page.getByRole('button', { name: 'Update Settings' });
    this.newProfile = page.getByRole('navigation');
  }

  // Бизнес-сценарии на страничке
  async updateName(username) {
    await this.nameInput.click();
    await this.nameInput.fill(username);
  }
  async updatePassword(password) {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
  }
  async updateEmail(email) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  async saveChanges() {
    await this.settingsButton.click();
  }
}
