export class ArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('div.container h1');
    this.articleText = page.getByRole('paragraph');
    this.EditButton = page.getByRole('link', { name: 'Edit Article' }).first();
    this.comment = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.yourComment = page.locator('.card-block .card-text');
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
  async postComment(commentText) {
    await this.comment.click();
    await this.comment.fill(commentText);
    await this.postCommentButton.click();
  }
  getyourComment() {
    return this.yourComment;
  }
}
