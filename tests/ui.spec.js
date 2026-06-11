import { test, expect } from '@playwright/test';
import { UserBuilder, ArticleBuilder, CommentBuilder } from '../src/helpers/builders';
import { App } from '../pages/app';
// то, что перед каждым тестом
let testUser;

test.beforeEach(async ({ page }) => {
  //создали через билдер объект юзера
  testUser = new UserBuilder().withEmail().withPassword().withUsername().build();
  // Деструктуризация объекта - разбираем объект на переменные
  //const { email, password, username } = testUser;
  const app = new App(page);
  //  Переходим на сайт и регистрируемся
  await app.main.goto();
  await app.main.gotoRegister();
  await app.register.signup(testUser.username, testUser.email, testUser.password);
});

// тест 0 - проверка успешной регистрации пользователя
test('Пользователь может зарегистрироваться используя email и пароль', async ({ page }) => {
  //Инициализируем страницу feed (остальное в before)
  const app = new App(page);
  await expect(app.yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 1 - проверка успешной смены имени пользователя
test('Пользователь может поменять имя', async ({ page }) => {
  let newUsername = new UserBuilder().withUsername().build();

  //Инициализируем странички
  const app = new App(page);
  // меняем в настройках имя и проверяем отображение
  await app.main.gotoSettings();
  await app.settings.updateName(newUsername.username);
  await app.settings.saveChanges();
  await expect(app.settings.settingsButton).toBeHidden();
  await expect(app.settings.newProfile).toContainText(newUsername.username);
});

// тест 2 - проверка успешной смены пароля пользователя и логина с новым паролем
test('Пользователь может поменять пароль и залогиниться потом с новым паролем', async ({
  page,
}) => {
  let newPassword = new UserBuilder().withPassword().build();
  //Инициализируем странички
  const app = new App(page);
  // меняем в настройках пароль
  await app.main.gotoSettings();
  await app.settings.updatePassword(newPassword.password);
  await app.settings.saveChanges();
  await expect(app.settings.settingsButton).toBeHidden();
  //логаут и логин с новым паролем
  await app.main.gotologout();
  await app.main.gotologin();
  await app.login.login(testUser.email, newPassword.password);
  await expect(app.yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 3 - пользователь может поменять email и авторизоваться потом с новым email
test('Пользователь может поменять email и залогиниться потом с новым email', async ({ page }) => {
  let newEmail = new UserBuilder().withEmail().build();
  //Инициализируем странички через фасад
  const app = new App(page);
  // меняем в настройках email
  await app.main.gotoSettings();
  await app.settings.updateEmail(newEmail.email);
  await app.settings.saveChanges();
  await expect(app.settings.settingsButton).toBeHidden();
  //логаут и логин с новым email
  await app.main.gotologout();
  await app.main.gotologin();
  await app.login.login(newEmail.email, testUser.password);
  await expect(app.yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 4 - пользователь может создать статью
test('Пользователь может создать статью', async ({ page }) => {
  //генерируем название статьи итд
  let article = new ArticleBuilder().withTitle().withDesc().withText().build();
  // Инициализируем странички через фасад App
  const app = new App(page);
  // заходим на создание статьи
  await app.yourfeed.createArticle();
  // создаем статью
  await app.createArticle.makeArticle(article.title, article.desc, article.text);
  //переходим в профиль и в статью
  // проверяем наличие нашей статьи
  await expect(app.article.getArticleTitle()).toContainText(article.title);
  await expect(app.article.getArticleText()).toContainText(article.text);
});

//Тест 5  - пользователь может поменять текст статьи
test('Пользователь может изменить текст статьи', async ({ page }) => {
  //генерируем название статьи итд
  let article = new ArticleBuilder().withTitle().withDesc().withText().build();
  let newText = new ArticleBuilder().withText().build();
  // Инициализируем странички
  const app = new App(page);
  // заходим на создание статьи
  await app.yourfeed.createArticle();
  // создаем статью
  await app.createArticle.makeArticle(article.title, article.desc, article.text);
  // проверяем наличие нашей статьи
  await expect(app.article.getArticleTitle()).toContainText(article.title);
  await expect(app.article.getArticleText()).toContainText(article.text);
  // нажимаем на "edit article", вносим правки и сохраняем
  await app.article.updateArticle();
  // на новой странице редактирования меняем
  await app.editArticle.updateArticle(article.title, article.desc, newText.text);
  //проверяем измененный текст
  await expect(app.article.getArticleTitle()).toContainText(article.title);
  await expect(app.article.getArticleText()).toContainText(newText.text);
});

// тест 6 - пользователь может оставить комментарий к статье
test('Пользователь может оставить комментарий', async ({ page }) => {
  //генерируем название статьи итд
  let article = new ArticleBuilder().withTitle().withDesc().withText().build();
  let comment = new CommentBuilder().withComment().build();
  // Инициализируем странички
  const app = new App(page);
  // заходим на создание статьи
  await app.yourfeed.createArticle();
  // создаем статью
  await app.createArticle.makeArticle(article.title, article.desc, article.text);
  // проверяем наличие нашей статьи
  await expect(app.article.getArticleTitle()).toContainText(article.title);
  await expect(app.article.getArticleText()).toContainText(article.text);
  //добавляем комментарий
  await app.article.postComment(comment.comment);
  //проверяем комментарий
  await expect(app.article.getyourComment()).toContainText(comment.comment);
});

// тест 7 - при клике на тэг - отображается статья с этим тэгом
test('Отображается статья с тэгом при клике на тэг', async ({ page }) => {
  // Инициализируем странички
  const app = new App(page);
  //кликаем на тэг, сохраняем его имя
  const tagName = await app.yourfeed.getArticlesWithTags();
  // Проверяем, что тег есть в статьях
  await expect(app.yourfeed.getArticleTag()).toContainText(tagName);
});
