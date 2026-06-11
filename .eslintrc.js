module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:playwright/playwright-test'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Можешь добавить свои правила, например:
    'no-console': 'warn', // Предупреждать, если используешь console.log
  },
};
