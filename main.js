import { Command } from 'commander';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { join, resolve, extname } from 'path';

import { checkFile } from './source/lint.js';

/**
 * Проверяет, имеет ли файл одно из указанных расширений
 * @param {string} filePath — путь или имя файла
 * @param {string[]} allowedExtensions — массив расширений, например ['.md', '.ct']
 * @returns {boolean} true, если расширение подходит
 */
function hasAllowedExtension(filePath, allowedExtensions) {
    const ext = extname(filePath).toLowerCase();
    return allowedExtensions.some(extName => extName.toLowerCase() === ext);
  }

// Функция обработки одного файла
function processFile(filePath) {
  // console.log(`📁 Обрабатываю файл: ${filePath}`);

  if (hasAllowedExtension(filePath, ['.md', '.ct'])) {
    checkFile(filePath);
  }
}

// Рекурсивная функция для обхода каталога
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
      processDirectory(filePath); // рекурсивный вызов
    }
  }
}

// Основная функция обработки пути (файл или каталог)
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
    console.log(`📂 Начинаю рекурсивную обработку каталога: ${fullPath}`);
    processDirectory(fullPath);
  } else {
    console.error(`❌ Указанный путь не является ни файлом, ни каталогом: ${fullPath}`);
    process.exit(1);
  }
}

// Настройка CLI
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