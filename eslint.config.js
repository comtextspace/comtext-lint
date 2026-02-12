// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';

export default [
  // Включаем рекомендованные правила ESLint
  js.configs.recommended,

  // Основная конфигурация для Node.js + ESM
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module', // важно для ESM (type: "module")
      globals: {
        ...globals.node, // добавляем глобальные переменные Node.js (process, __dirname и т.д.)
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    },
  },

  // Конфигурация для тестов
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // добавляем глобальные переменные Jest
      },
    },
  },

  // Игнорируемые файлы (вместо .eslintignore)
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.config.js',
      '.env',
      'coverage/',
    ],
  },
];