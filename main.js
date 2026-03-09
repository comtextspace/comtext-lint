// main.js
import { Command } from 'commander';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { join, resolve, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

import { checkFile, ALLOWED_EXTENSIONS } from './source/lint.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

// Функция обработки одного файла
function processFile(filePath) {
  if (!ALLOWED_EXTENSIONS.includes(extname(filePath).toLowerCase())) {
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

// Обходит каталог рекурсивно и проверяет все файлы
function processDirectory(dirPath) {
  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true, recursive: true });
  } catch (err) {
    console.error(`❌ Не удалось прочитать каталог: ${dirPath}`, err.message);
    return;
  }

  for (const entry of entries) {
    if (entry.isFile()) {
      processFile(join(entry.parentPath, entry.name));
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
  .action(processPath);

program.parse();