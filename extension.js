// extension.js
import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { correctComtext } from '@comtext/ocr-fix';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let diagnosticCollection;

export function activate(context) {
  // Создаём коллекцию диагностики один раз
  if (!diagnosticCollection) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('comtext-lint');
    context.subscriptions.push(diagnosticCollection);
  }

  // Регистрируем команду проверки формата
  const checkCommand = vscode.commands.registerCommand('comtext-lint.checkFormat', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await runLint(editor.document);
    }
  });

  // Регистрируем команду исправления OCR-текста
  const correctCommand = vscode.commands.registerCommand('comtext-lint.correctOcr', async () => {
    const editor = vscode.window.activeTextEditor;
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

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, correctedText);
    });

    vscode.window.showInformationMessage('Comtext OCR Fix: текст успешно исправлен');
  });

  // Подписываемся на сохранение — сразу при активации
  const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
    const config = vscode.workspace.getConfiguration('comtext-lint');
    if (!config.get('enableOnSave', true)) return;

    // runLint сам проверяет расширения
    await runLint(document);
  });

  context.subscriptions.push(checkCommand, correctCommand, saveListener);

  // 🔥 Запускаем проверку для уже открытых Markdown-файлов
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.document.languageId === 'markdown') {
    // Не ждём — просто запускаем фоновую проверку
    runLint(activeEditor.document).catch(() => {});
  }
}

async function runLint(document) {
  const filePath = document.uri.fsPath;

  // Очищаем предыдущие ошибки
  diagnosticCollection.set(document.uri, []);

  // Проверяем только нужные расширения
  if (!filePath.endsWith('.md') && !filePath.endsWith('.ct')) {
    return;
  }

  const scriptPath = join(__dirname, 'main.js');
  if (!existsSync(scriptPath)) {
    vscode.window.showErrorMessage(`Скрипт не найден: ${scriptPath}`);
    return;
  }

  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, filePath], {
      cwd: __dirname,
      env: { ...process.env }
    });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      vscode.window.showErrorMessage(`Ошибка запуска comtext-lint: ${err.message}`);
      reject(err);
    });

    child.on('close', () => {
      try {
        if (stderr.trim()) {
          const diagnostics = parseComtextLintOutput(stderr, document);
          diagnosticCollection.set(document.uri, diagnostics);
        } else {
          diagnosticCollection.set(document.uri, []);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}

function parseComtextLintOutput(output, document) {
  const diagnostics = [];
  const lines = output.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(/^(.+?):(\d+):(\d+):\s*(.+)$/);
    if (match) {
      const [, file, l, c, message] = match;
      if (file === document.uri.fsPath) {
        const lineNumber = Math.max(0, parseInt(l, 10) - 1);
        const column = Math.max(0, parseInt(c, 10) - 1);
        const range = new vscode.Range(lineNumber, column, lineNumber, column + 1);
        diagnostics.push(new vscode.Diagnostic(range, message.trim(), vscode.DiagnosticSeverity.Warning));
      }
    }
  }

  return diagnostics;
}

export function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.clear();
    diagnosticCollection.dispose();
    diagnosticCollection = undefined;
  }
}