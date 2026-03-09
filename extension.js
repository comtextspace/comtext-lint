// extension.js
import * as vscode from 'vscode';
import { readdir, readFile, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { correctComtext } from '@comtext/ocr-fix';

import { checkFile, ALLOWED_EXTENSIONS } from './source/lint.js';

let diagnosticCollection;
let lastActiveEditor;

/**
 * Возвращает текущий активный редактор.
 * Нужно для команд из палитры (Ctrl+Shift+P), где activeTextEditor
 * может быть undefined в момент вызова.
 */
function getActiveEditor() {
  return vscode.window.activeTextEditor
    ?? lastActiveEditor
    ?? vscode.window.visibleTextEditors[0];
}

export function activate(context) {
  // Запоминаем последний активный редактор
  const editorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) lastActiveEditor = editor;
  });
  if (vscode.window.activeTextEditor) {
    lastActiveEditor = vscode.window.activeTextEditor;
  }
  context.subscriptions.push(editorListener);

  // Создаём коллекцию диагностики один раз
  diagnosticCollection = vscode.languages.createDiagnosticCollection('comtext-lint');
  context.subscriptions.push(diagnosticCollection);

  // Регистрируем команду проверки формата
  const checkCommand = vscode.commands.registerCommand('comtext-lint.checkFormat', async () => {
    try {
      const editor = getActiveEditor();

      if (!editor) {
        vscode.window.showWarningMessage('Нет открытого файла для проверки');
        return;
      }

      await runLint(editor.document);
    } catch (err) {
      vscode.window.showErrorMessage(`Comtext Lint: ошибка — ${err.message}`);
    }
  });

  // Регистрируем команду исправления OCR-текста
  const correctCommand = vscode.commands.registerCommand('comtext-lint.correctOcr', async () => {
    try {
      const editor = getActiveEditor();

      if (!editor) {
        vscode.window.showWarningMessage('Нет открытого файла для исправления');
        return;
      }

      const document = editor.document;
      const originalText = document.getText();
      const correctedText = correctComtext(originalText);

      if (correctedText === originalText) {
        vscode.window.showInformationMessage('Comtext OCR Fix: текст уже корректен, изменений нет');
        return;
      }

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(originalText.length)
      );

      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.replace(document.uri, fullRange, correctedText);
      await vscode.workspace.applyEdit(workspaceEdit);

      vscode.window.showInformationMessage('Comtext OCR Fix: текст успешно исправлен');
    } catch (err) {
      vscode.window.showErrorMessage(`Comtext OCR Fix: ошибка — ${err.message}`);
    }
  });

  // Подписываемся на сохранение — сразу при активации
  const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
    const config = vscode.workspace.getConfiguration('comtext-lint');
    if (!config.get('enableOnSave', true)) return;

    // runLint сам проверяет расширения
    await runLint(document);
  });

  // Регистрируем команду исправления OCR-текста только в текущей папке (без подпапок)
  const correctFolderShallowCommand = vscode.commands.registerCommand('comtext-lint.correctOcrFolderShallow', async (folderUri) => {
    if (!folderUri) {
      vscode.window.showWarningMessage('Команда должна вызываться из контекстного меню папки');
      return;
    }
    await runCorrectOcrInFolder(folderUri.fsPath, false);
  });

  // Регистрируем команду исправления OCR-текста во всей папке рекурсивно
  const correctFolderCommand = vscode.commands.registerCommand('comtext-lint.correctOcrFolder', async (folderUri) => {
    if (!folderUri) {
      vscode.window.showWarningMessage('Команда должна вызываться из контекстного меню папки');
      return;
    }
    await runCorrectOcrInFolder(folderUri.fsPath, true);
  });

  context.subscriptions.push(checkCommand, correctCommand, correctFolderShallowCommand, correctFolderCommand, saveListener);

  // Запускаем проверку для уже открытого файла нужного расширения
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && ALLOWED_EXTENSIONS.includes(
    extname(activeEditor.document.uri.fsPath).toLowerCase()
  )) {
    // Не ждём — просто запускаем фоновую проверку
    runLint(activeEditor.document).catch(() => {});
  }
}

/**
 * Исправляет OCR-текст во всех файлах указанной папки.
 * @param {string} folderPath
 * @param {boolean} recursive — обходить подпапки рекурсивно
 */
async function runCorrectOcrInFolder(folderPath, recursive) {
  const entries = await readdir(folderPath, { withFileTypes: true, recursive });
  const files = entries
    .filter(e => e.isFile() && ALLOWED_EXTENSIONS.includes(extname(e.name).toLowerCase()))
    .map(e => join(e.parentPath ?? e.path, e.name));

  if (files.length === 0) {
    vscode.window.showInformationMessage('Comtext OCR Fix: файлы .md и .ct в папке не найдены');
    return;
  }

  let count = 0;
  for (const filePath of files) {
    const original = await readFile(filePath, 'utf8');
    const corrected = correctComtext(original);
    if (corrected !== original) {
      await writeFile(filePath, corrected, 'utf8');
      count++;
    }
  }

  vscode.window.showInformationMessage(
    `Comtext OCR Fix: обработано ${count} из ${files.length} файлов`
  );
}

async function runLint(document) {
  const filePath = document.uri.fsPath;

  // Очищаем предыдущие ошибки
  diagnosticCollection.set(document.uri, []);

  // Проверяем только нужные расширения
  if (!ALLOWED_EXTENSIONS.includes(extname(filePath).toLowerCase())) {
    return;
  }

  let messages;
  try {
    messages = checkFile(filePath);
  } catch (err) {
    vscode.window.showErrorMessage(`Comtext Lint: ошибка — ${err.message}`);
    return;
  }

  // null — файл не подлежит проверке (нет format: comtext)
  if (!messages) {
    return;
  }

  const diagnostics = messages.map(({ line, column, reason }) => {
    const lineNumber = Math.max(0, line - 1);
    const col = Math.max(0, column - 1);
    const range = new vscode.Range(lineNumber, col, lineNumber, col + 1);
    return new vscode.Diagnostic(range, reason, vscode.DiagnosticSeverity.Warning);
  });

  diagnosticCollection.set(document.uri, diagnostics);
}

export function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.clear();
    diagnosticCollection.dispose();
    diagnosticCollection = undefined;
  }
}
