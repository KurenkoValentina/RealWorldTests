export class ArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('div.container h1');
    this.articleText = page.getByRole('paragraph');
    this.EditButton = page.getByRole('link', { name: 'Edit Article' }).first();
  }
  getArticleTitle() {
    return this.articleTitle;
  }
  getArticleText() {
    return this.articleText;
  }
  async updateArticle() {
    await this.EditButton.click();
  }
}
