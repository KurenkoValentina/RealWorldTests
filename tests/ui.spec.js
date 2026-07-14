import { UserBuilder, ArticleBuilder, CommentBuilder } from '../src/helpers/builders';
//import { App } from '../src/pages/app';
import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/fixture';

//регистрация перед каждым тестом
let testUser;

test.beforeEach(async ({ webApp }) => {
  //создали через билдер объект юзера
  testUser = new UserBuilder().withEmail().withPassword().withUsername().build();
  // Деструктуризация объекта - разбираем объект на переменные
  //const { email, password, username } = testUser;
  //  Переходим на сайт и регистрируемся
  await webApp.main.gotoRegister();
  await webApp.register.signup(testUser.username, testUser.email, testUser.password);
});

// тест 0 - проверка успешной регистрации пользователя
test('Пользователь может зарегистрироваться используя email и пароль', async ({ webApp }) => {
  await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 1 - проверка успешной смены имени пользователя
test('Пользователь может поменять имя', async ({ webApp }) => {
  let newUsername = new UserBuilder().withUsername().build();

  // меняем в настройках имя и проверяем отображение
  await webApp.main.gotoSettings();
  await webApp.settings.updateName(newUsername.username);
  await webApp.settings.saveChanges();
  await expect(webApp.settings.settingsButton).toBeHidden();
  await expect(webApp.settings.newProfile).toContainText(newUsername.username);
});

// тест 2 - проверка успешной смены пароля пользователя и логина с новым паролем
test('Пользователь может поменять пароль и залогиниться потом с новым паролем', async ({
  webApp,
}) => {
  let newPassword = new UserBuilder().withPassword().build();
  // меняем в настройках пароль
  await webApp.main.gotoSettings();
  await webApp.settings.updatePassword(newPassword.password);
  await webApp.settings.saveChanges();
  await expect(webApp.settings.settingsButton).toBeHidden();
  //логаут и логин с новым паролем
  await webApp.main.gotologout();
  await webApp.main.gotologin();
  await webApp.login.login(testUser.email, newPassword.password);
  await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 3 - пользователь может поменять email и авторизоваться потом с новым email
test('Пользователь может поменять email и залогиниться потом с новым email', async ({ webApp }) => {
  let newEmail = new UserBuilder().withEmail().build();
  //Инициализируем странички через фасад
  //const app = new App(page);
  // меняем в настройках email
  await webApp.main.gotoSettings();
  await webApp.settings.updateEmail(newEmail.email);
  await webApp.settings.saveChanges();
  await expect(webApp.settings.settingsButton).toBeHidden();
  //логаут и логин с новым email
  await webApp.main.gotologout();
  await webApp.main.gotologin();
  await webApp.login.login(newEmail.email, testUser.password);
  await expect(webApp.yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 4 - пользователь может создать статью
test('Пользователь может создать статью', async ({ webApp }) => {
  //генерируем название статьи итд
  let article = new ArticleBuilder().withTitle().withDesc().withText().build();
  // заходим на создание статьи
  await webApp.yourfeed.createArticle();
  // создаем статью
  await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
  //переходим в профиль и в статью
  // проверяем наличие нашей статьи
  await expect(webApp.article.getArticleTitle()).toContainText(article.title);
  await expect(webApp.article.getArticleText()).toContainText(article.text);
});

//Тест 5  - пользователь может поменять текст статьи
test('Пользователь может изменить текст статьи', async ({ webApp }) => {
  //генерируем название статьи итд
  let article = new ArticleBuilder().withTitle().withDesc().withText().build();
  let newText = new ArticleBuilder().withText().build();
  // заходим на создание статьи
  await webApp.yourfeed.createArticle();
  // создаем статью
  await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
  // проверяем наличие нашей статьи
  await expect(webApp.article.getArticleTitle()).toContainText(article.title);
  await expect(webApp.article.getArticleText()).toContainText(article.text);
  // нажимаем на "edit article", вносим правки и сохраняем
  await webApp.article.updateArticle();
  // на новой странице редактирования меняем
  await webApp.editArticle.updateArticle(article.title, article.desc, newText.text);
  //проверяем измененный текст
  await expect(webApp.article.getArticleTitle()).toContainText(article.title);
  await expect(webApp.article.getArticleText()).toContainText(newText.text);
});

// тест 6 - пользователь может оставить комментарий к статье
test('Пользователь может оставить комментарий', async ({ webApp }) => {
  //генерируем название статьи итд
  let article = new ArticleBuilder().withTitle().withDesc().withText().build();
  let comment = new CommentBuilder().withComment().build();
  // заходим на создание статьи
  await webApp.yourfeed.createArticle();
  // создаем статью
  await webApp.createArticle.makeArticle(article.title, article.desc, article.text);
  // проверяем наличие нашей статьи
  await expect(webApp.article.getArticleTitle()).toContainText(article.title);
  await expect(webApp.article.getArticleText()).toContainText(article.text);
  //добавляем комментарий
  await webApp.article.postComment(comment.comment);
  //проверяем комментарий
  await expect(webApp.article.getyourComment()).toContainText(comment.comment);
});

// тест 7 - при клике на тэг - отображается статья с этим тэгом
test('Отображается статья с тэгом при клике на тэг', async ({ webApp }) => {
  //кликаем на тэг, сохраняем его имя
  const tagName = await webApp.yourfeed.getArticlesWithTags();
  // Проверяем, что тег есть в статьях
  await expect(webApp.yourfeed.getArticleTag()).toContainText(tagName);
});
