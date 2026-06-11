export class EditArticle {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('textbox', { name: 'Article Title' });
    this.description = page.getByRole('textbox', { name: "What's this article about?" });
    this.text = page.getByRole('textbox', { name: 'Write your article (in' });
    this.updateArticleButton = page.getByRole('button', { name: 'Update Article' });
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
