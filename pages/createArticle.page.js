export class CreateArticle {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('textbox', { name: 'Article Title' });
    this.description = page.getByRole('textbox', { name: "What's this article about?" });
    this.text = page.getByRole('textbox', { name: 'Write your article (in' });
    this.createArticleButton = page.getByRole('button', { name: 'Publish Article' });
    this.updateArticleButton = page.getByRole('button', { name: 'Update Article' });
  }

  // Создание статьи
  async makeArticle(title, description, text) {
    await this.title.click();
    await this.title.fill(title);
    await this.description.click();
    await this.description.fill(description);
    await this.text.click();
    await this.text.fill(text);
    await this.createArticleButton.click();
  }
  // изменение текста статьи
  async updateArticle(title, description, text) {
    await this.title.click();
    await this.title.fill(title);
    await this.description.click();
    await this.description.fill(description);
    await this.text.click();
    await this.text.fill(text);
    await this.updateArticleButton.click();
  }
}
