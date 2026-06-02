export class YourfeedPage {
  constructor(page) {
    // это браузер
    this.page = page;
    // здесь мы описываем техническую реализацию страницы
    // здесь все про элементы
    this.profileName = page.getByRole('navigation');
    this.article = page.getByRole('link', { name: 'New Article' });
  }

  // Бизнес-сценарии на страничке

  getProfileName() {
    return this.profileName;
  }
  async createArticle() {
    await this.article.click();
  }
}
