import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../pages/main.page';
import { RegisterPage } from '../pages/register.page';
import { YourfeedPage } from '../pages/yourFeedPage';
import { SettingsPage } from '../pages/settings.page';
import { LoginPage } from '../pages/login.page';

// todo при добавлении нового теста, данные будут использованы те же самые
const url = 'https://realworld.qa.guru/';

// тест 0 - проверка успешной регистрации пользователя
test('Пользователь может зарегистрироваться используя email и пароль', async ({ page }) => {
  let username = faker.person.fullName();
  let email = faker.internet.email({ lastName: 'BIN', provider: 'robot.dev' });
  let password = faker.internet.password(); // '89G1wJuBLbGziIs'
  await page.goto(url);
  //Инициализируем странички
  const main = new MainPage(page);
  const register = new RegisterPage(page);
  const yourfeed = new YourfeedPage(page);

  await main.gotoRegister();
  await register.signup(username, email, password);
  //временный вариант
  // await expect(yourfeed.profileName).toContainText(username);
  await expect(yourfeed.getProfileName()).toContainText(username);
});
// тест 1 - проверка успешной смены имени пользователя
test('Пользователь может поменять имя', async ({ page }) => {
  let username = faker.person.fullName();
  let newUsername = faker.person.fullName();
  let email = faker.internet.email({ lastName: 'BIN', provider: 'robot.dev' });
  let password = faker.internet.password(); // '89G1wJuBLbGziIs'
  await page.goto(url);
  //Инициализируем странички
  const main = new MainPage(page);
  const register = new RegisterPage(page);
  const yourfeed = new YourfeedPage(page);
  const settings = new SettingsPage(page);
  // регистрируемся
  await main.gotoRegister();
  await register.signup(username, email, password);
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
  let username = faker.person.fullName();
  let email = faker.internet.email({ lastName: 'BIN', provider: 'robot.dev' });
  let password = faker.internet.password();
  let newPassword = faker.internet.password();
  await page.goto(url);
  //Инициализируем странички
  const main = new MainPage(page);
  const register = new RegisterPage(page);
  const settings = new SettingsPage(page);
  const login = new LoginPage(page);
  const yourfeed = new YourfeedPage(page);
  // регистрируемся
  await main.gotoRegister();
  await register.signup(username, email, password);
  // меняем в настройках пароль
  await main.gotoSettings();
  await settings.updatePassword(newPassword);
  await settings.saveChanges();
  await expect(settings.settingsButton).toBeHidden();
  //логаут и логин с новым паролем
  await main.gotologout();
  await main.gotologin();
  await login.login(email, newPassword);
  await expect(yourfeed.getProfileName()).toContainText(username);
});
