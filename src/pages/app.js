import {
  MainPage,
  RegisterPage,
  YourfeedPage,
  SettingsPage,
  LoginPage,
  CreateArticle,
  ArticlePage,
  EditArticle,
} from './index';

// Фасад

export class App {
  constructor(page) {
    this.page = page;
    this.main = new MainPage(page);
    this.register = new RegisterPage(page);
    this.yourfeed = new YourfeedPage(page);
    this.settings = new SettingsPage(page);
    this.login = new LoginPage(page);
    this.createArticle = new CreateArticle(page);
    this.article = new ArticlePage(page);
    this.editArticle = new EditArticle(page);
  }
}
