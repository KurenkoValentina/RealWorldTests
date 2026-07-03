//фикстуры без серверного следа (без создания и очистки данных)
import { test as base } from '@playwright/test';
import { App } from '../../pages/app';
//фикстуры по открытию страницы и созданию юзера и регистрации
export const test = base.extend({
  webApp: async ({ page }, use) => {
    const app = new App(page);
    await app.main.goto();
    await use(app);
  },
});
