// main.js
import { Command } from 'commander';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { join, resolve, extname } from 'path';

import { checkFile } from './source/lint.js';

/**
 * Проверяет, имеет ли файл одно из указанных расширений
 */
function hasAllowedExtension(filePath, allowedExtensions) {
  const ext = extname(filePath).toLowerCase();
  return allowedExtensions.some(extName => extName.toLowerCase() === ext);
}

// Функция обработки одного файла — теперь возвращает ошибки в нужном формате
function processFile(filePath) {
  if (!hasAllowedExtension(filePath, ['.md', '.ct'])) {
    return;
  }

  // Перехватываем ошибки из checkFile
  const originalConsoleError = console.error;
  const errors = [];

  // Подменяем console.error, чтобы собрать ошибки
  console.error = (...args) => {
    errors.push(args.join(' '));
  };

  try {
    checkFile(filePath);
  } finally {
    // Восстанавливаем оригинальный console.error
    console.error = originalConsoleError;
  }

  // Если checkFile использует vfile и не пишет в console.error,
  // вам нужно модифицировать checkFile напрямую (см. ниже).
  
  // Выводим ошибки в формате: file:line:col: message
  for (const err of errors) {
    // Пример: если ошибка уже в формате "file:12:3: message" — просто выводим
    // Иначе — нужно парсить и преобразовывать
    console.error(err);
  }

  // ⚠️ Если checkFile НЕ использует console.error, а просто возвращает ошибки,
  // тогда нужно изменить саму функцию checkFile.
}

// Рекурсивная функция для каталога
function processDirectory(dirPath) {
  let files;
  try {
    files = readdirSync(dirPath);
  } catch (err) {
    console.error(`❌ Не удалось прочитать каталог: ${dirPath}`, err.message);
    return;
  }

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stat = lstatSync(filePath);

    if (stat.isFile()) {
      processFile(filePath);
    } else if (stat.isDirectory()) {
      processDirectory(filePath);
    }
  }
}

function processPath(inputPath) {
  const fullPath = resolve(inputPath);

  if (!existsSync(fullPath)) {
    console.error(`❌ Путь не существует: ${inputPath}`);
    process.exit(1);
  }

  const stats = lstatSync(fullPath);

  if (stats.isFile()) {
    processFile(fullPath);
  } else if (stats.isDirectory()) {
    processDirectory(fullPath);
  } else {
    console.error(`❌ Указанный путь не является ни файлом, ни каталогом: ${fullPath}`);
    process.exit(1);
  }
}

const program = new Command();

program
  .name('Comtext-lint')
  .description('CLI для проверки файлов на соответствие формату Comtext')
  .version('1.0.0');

program
  .argument('<path>', 'путь к файлу или каталогу')
  .action((inputPath) => {
    processPath(inputPath);
  });

program.parse();