// main.js
import { Command } from 'commander';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { join, resolve, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

import { checkFile } from './source/lint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { version } = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

/**
 * Проверяет, имеет ли файл одно из указанных расширений
 */
function hasAllowedExtension(filePath, allowedExtensions) {
  const ext = extname(filePath).toLowerCase();
  return allowedExtensions.some(extName => extName.toLowerCase() === ext);
}

// Функция обработки одного файла
function processFile(filePath) {
  if (!hasAllowedExtension(filePath, ['.md', '.ct'])) {
    return;
  }

  const messages = checkFile(filePath);

  // null означает, что файл не подлежит проверке
  if (!messages) {
    return;
  }

  for (const { line, column, reason } of messages) {
    console.error(`${filePath}:${line}:${column}: ${reason}`);
  }

  if (messages.length > 0) {
    process.exitCode = 1;
  }
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
  .version(version);

program
  .argument('<path>', 'путь к файлу или каталогу')
  .action((inputPath) => {
    processPath(inputPath);
  });

program.parse();