export class YourfeedPage {
  constructor(page) {
    // это браузер
    this.page = page;
    // здесь мы описываем техническую реализацию страницы
    // здесь все про элементы
    this.profileName = page.getByRole('navigation');
    this.article = page.getByRole('link', { name: 'New Article' });
    this.popularTag = page.locator('aside .tag-list .tag-pill').first();
    this.articleTag = page.locator('.article-preview .tag-list .tag-pill').first();
  }

  // Бизнес-сценарии на страничке

  getProfileName() {
    return this.profileName;
  }
  async createArticle() {
    await this.article.click();
  }
  async getArticlesWithTags() {
    const tagName = await this.popularTag.textContent();
    await this.popularTag.click();
    return tagName;
  }
  getArticleTag() {
    // Используем уже определённый articleTag!
    return this.articleTag;
  }
}
