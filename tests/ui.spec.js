import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../pages/main.page';
import { RegisterPage } from '../pages/register.page';
import { YourfeedPage } from '../pages/yourFeedPage';
import { SettingsPage } from '../pages/settings.page';
import { LoginPage } from '../pages/login.page';
import { CreateArticle } from '../pages/createArticle.page';
import { ArticlePage } from '../pages/article.page';
import { EditArticle } from '../pages/editArticle.page';
// то, что перед каждым тестом
const url = 'https://realworld.qa.guru/';
let testUser;

test.beforeEach(async ({ page }) => {
  testUser = {
    username: faker.person.fullName(),
    email: faker.internet.email({ lastName: 'BIN', provider: 'robot.dev' }),
    password: faker.internet.password(),
  };
  const main = new MainPage(page);
  const register = new RegisterPage(page);
  //  Переходим на сайт и регистрируемся
  await page.goto(url);
  await main.gotoRegister();
  await register.signup(testUser.username, testUser.email, testUser.password);
});

// тест 0 - проверка успешной регистрации пользователя
test('Пользователь может зарегистрироваться используя email и пароль', async ({ page }) => {
  //Инициализируем страницу feed (остальное в before)
  const yourfeed = new YourfeedPage(page);
  await expect(yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 1 - проверка успешной смены имени пользователя
test('Пользователь может поменять имя', async ({ page }) => {
  let newUsername = faker.person.fullName();

  //Инициализируем странички
  const main = new MainPage(page);
  const settings = new SettingsPage(page);
  // меняем в настройках имя и проверяем отображение
  await main.gotoSettings();
  await settings.updateName(newUsername);
  await settings.saveChanges();
  await expect(settings.settingsButton).toBeHidden();
  await expect(settings.newProfile).toContainText(newUsername);
});

// тест 2 - проверка успешной смены пароля пользователя и логина с новым паролем
test('Пользователь может поменять пароль и залогиниться потом с новым паролем', async ({
  page,
}) => {
  let newPassword = faker.internet.password();
  //Инициализируем странички
  const main = new MainPage(page);
  const settings = new SettingsPage(page);
  const login = new LoginPage(page);
  const yourfeed = new YourfeedPage(page);
  // меняем в настройках пароль
  await main.gotoSettings();
  await settings.updatePassword(newPassword);
  await settings.saveChanges();
  await expect(settings.settingsButton).toBeHidden();
  //логаут и логин с новым паролем
  await main.gotologout();
  await main.gotologin();
  await login.login(testUser.email, newPassword);
  await expect(yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 3 - пользователь может поменять email и авторизоваться потом с новым email
test('Пользователь может поменять email и залогиниться потом с новым email', async ({ page }) => {
  let newEmail = faker.internet.email({ lastName: 'BIN', provider: 'robot.dev' });
  //Инициализируем странички
  const main = new MainPage(page);
  const settings = new SettingsPage(page);
  const login = new LoginPage(page);
  const yourfeed = new YourfeedPage(page);
  // меняем в настройках email
  await main.gotoSettings();
  await settings.updateEmail(newEmail);
  await settings.saveChanges();
  await expect(settings.settingsButton).toBeHidden();
  //логаут и логин с новым email
  await main.gotologout();
  await main.gotologin();
  await login.login(newEmail, testUser.password);
  await expect(yourfeed.getProfileName()).toContainText(testUser.username);
});

// тест 4 - пользователь может создать статью
test('Пользователь может создать статью', async ({ page }) => {
  //генерируем название статьи итд
  let title = faker.lorem.words(5);
  let description = faker.lorem.sentences(2);
  let text = faker.lorem.paragraphs(3);
  // Инициализируем странички
  const yourfeed = new YourfeedPage(page);
  const createArticle = new CreateArticle(page);
  const article = new ArticlePage(page);
  // заходим на создание статьи
  await yourfeed.createArticle();
  // создаем статью
  await createArticle.makeArticle(title, description, text);
  //переходим в профиль и в статью
  // проверяем наличие нашей статьи
  await expect(article.getArticleTitle()).toContainText(title);
  await expect(article.getArticleText()).toContainText(text);
});

//Тест 5  - пользователь может поменять текст статьи
test('Пользователь может изменить текст статьи', async ({ page }) => {
  //генерируем название статьи итд
  let title = faker.lorem.words(5);
  let description = faker.lorem.sentences(2);
  let text = faker.lorem.paragraphs(3);
  let newText = faker.lorem.paragraphs(3);
  // Инициализируем странички
  const yourfeed = new YourfeedPage(page);
  const createArticle = new CreateArticle(page);
  const article = new ArticlePage(page);
  const editArticle = new EditArticle(page);
  // заходим на создание статьи
  await yourfeed.createArticle();
  // создаем статью
  await createArticle.makeArticle(title, description, text);
  // проверяем наличие нашей статьи
  await expect(article.getArticleTitle()).toContainText(title);
  await expect(article.getArticleText()).toContainText(text);
  // нажимаем на "edit article", вносим правки и сохраняем
  await article.updateArticle();
  // на новой странице редактирования меняем
  await editArticle.updateArticle(title, description, newText);
  //проверяем измененный текст
  await expect(article.getArticleTitle()).toContainText(title);
  await expect(article.getArticleText()).toContainText(newText);
});

// тест 6 - пользователь может оставить комментарий к статье
test('Пользователь может оставить комментарий', async ({ page }) => {
  //генерируем название статьи итд
  let title = faker.lorem.words(5);
  let description = faker.lorem.sentences(2);
  let text = faker.lorem.paragraphs(3);
  let commentText = faker.lorem.sentences(2);
  // Инициализируем странички
  const yourfeed = new YourfeedPage(page);
  const createArticle = new CreateArticle(page);
  const article = new ArticlePage(page);
  // заходим на создание статьи
  await yourfeed.createArticle();
  // создаем статью
  await createArticle.makeArticle(title, description, text);
  // проверяем наличие нашей статьи
  await expect(article.getArticleTitle()).toContainText(title);
  await expect(article.getArticleText()).toContainText(text);
  //добавляем комментарий
  await article.postComment(commentText);
  //проверяем комментарий
  await expect(article.getyourComment()).toContainText(commentText);
});

// тест 7 - при клике на тэг - отображается статья с этим тэгом
test('Отображается статья с тэгом при клике на тэг', async ({ page }) => {
  // Инициализируем странички
  const yourfeed = new YourfeedPage(page);
  //кликаем на тэг, сохраняем его имя
  const tagName = await yourfeed.getArticlesWithTags();
  // Проверяем, что тег есть в статьях
  await expect(yourfeed.getArticleTag()).toContainText(tagName);
});
