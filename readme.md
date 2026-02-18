# Comtext-lint

Консольная утилита и расширение для VS Code, проверяющее соответствие Markdown-файлов (`.md`, `.ct`) [формату Комтекст](https://research.comtext.space/format-comtext.html).

> ⚠️ **Важно**: Проверка выполняется **только для файлов**, в которых в YAML-фронтматтере указано `format: comtext`. Файлы без фронтматтера или с другим значением `format` игнорируются.

Пример файла, который будет проверяться:
```yaml
---
title: Название документа
version: 1.0
author: Автор
format: comtext
---

# Содержание документа
```

Проверка охватывает:
- наличие и структуру YAML-фронтматтера (обязательные поля: `title`, `version`, `author`, `format`),
- стиль заголовков, списков, цитат, ссылок и блоков кода,
- отступы, пустые строки, переносы и другие аспекты типографики,
- запрет HTML и других недопустимых элементов.

## Установка (локальная разработка)

```bash
git clone https://github.com/ваш-аккаунт/comtext-lint.git
cd comtext-lint
yarn install
```

> ⚠️ Для использования как **глобального CLI-инструмента** или **VS Code-расширения** см. разделы ниже.

## Использование из командной строки

```bash
yarn process <путь>
```

Где `<путь>` — это путь к файлу (`.md` или `.ct`) или каталогу.  
Утилита рекурсивно обходит каталоги и проверяет все файлы с расширениями `.md` или `.ct`, которые содержат фронтматтер с `format: comtext`.

Пример:
```bash
yarn process ./content/article.md
yarn process ./content/
```

## Установка как расширение VS Code / VSCodium

1. Соберите расширение:
   ```bash
   yarn run vsce package
   ```
2. Установите `.vsix`-файл:
   ```bash
   codium --install-extension comtext-lint-*.vsix
   ```
3. Перезапустите редактор.

### Возможности в редакторе

- 📌 **Ручной запуск**:  
  `Ctrl+Shift+P` → *Comtext Lint: Проверить формат файла*  
  Проверяет текущий открытый файл (если он имеет расширение `.md` или `.ct` и содержит фронтматтер с `format: comtext`).

- 🔁 **Автоматическая проверка при сохранении**:  
  Работает для всех `.md` и `.ct` файлов с фронтматтером `format: comtext`. Можно отключить в настройках:
  ```json
  {
    "comtext-lint.enableOnSave": false
  }
  ```

- 🚨 **Отображение ошибок**:  
  Все проблемы сразу появляются:
  - под строками в редакторе,
  - во вкладке **Problems** (`Ctrl+Shift+M`).

---

## Требования

- Node.js ≥ 20
- Yarn
- VS Code / VSCodium ≥ 1.102 (для расширения)

## Пакеты

### Основные пакеты

Для проверок используются пакеты

* [`remark-lint`](https://github.com/remarkjs/remark-lint)
* [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
* [`remark-frontmatter`](https://github.com/remarkjs/remark-frontmatter)

### Проверки

| Пакет                                                                                                                                               | Параметры    |
|-----------------------------------------------------------------------------------------------------------------------------------------------------|------------- |
| [`remark-lint-blockquote-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-blockquote-indentation)               | `2`          |
| [`remark-lint-code-block-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-code-block-style)                           | `'fenced'`   |
| [`remark-lint-correct-media-syntax`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-correct-media-syntax)                   |              |
| [`remark-lint-fenced-code-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-fenced-code-marker)                       | ``'`'``      |
| [`remark-lint-final-newline`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-final-newline)                                 |              |
| [`remark-lint-first-heading-level`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-first-heading-level)                     | `1`          |
| [`remark-lint-hard-break-spaces`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-hard-break-spaces)                         |              |
| [`remark-lint-heading-increment`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-increment)                         |              |
| [`remark-lint-heading-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-heading-style)                                 | `'atx'`      |
| [`remark-lint-linebreak-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-linebreak-style)                             | `'unix'`     |
| [`remark-lint-list-item-bullet-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-bullet-indent)             |              |
| [`remark-lint-list-item-content-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-content-indent)           |              |
| [`remark-lint-list-item-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-list-item-indent)                           | `'one'`      |
| [`remark-lint-media-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-media-style)                                     | `'resource'` |
| [`remark-lint-no-blockquote-without-marker`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-blockquote-without-marker)   |              |
| [`remark-lint-no-consecutive-blank-lines`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-consecutive-blank-lines)       |              |
| [`remark-lint-no-empty-url`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-empty-url)                                   |              |
| [`remark-lint-no-heading-content-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-content-indent)         |              |
| [`remark-lint-no-heading-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-indent)                         |              |
| [`remark-lint-no-heading-like-paragraph`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-like-paragraph)         |              |
| [`remark-lint-no-heading-punctuation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-punctuation)               | `',:;'`      |
| [`remark-lint-no-hidden-table-cell`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-hidden-table-cell)                   |              |
| [`remark-lint-no-html`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-html)                                             |              |
| [`remark-lint-no-missing-blank-lines`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-missing-blank-lines)               |              |
| [`remark-lint-no-multiple-toplevel-headings`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-multiple-toplevel-headings) |              |
| [`remark-lint-no-paragraph-content-indent`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-paragraph-content-indent)     |              |
| [`remark-lint-no-table-indentation`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-table-indentation)                   |              |
| [`remark-lint-no-tabs`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-tabs)                                             |              |
| [`remark-lint-no-unused-definitions`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-unused-definitions)                 |              |
| [`remark-lint-rule-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-rule-style)                                       | `'---'`      |
| [`remark-lint-unordered-list-marker-style`](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-unordered-list-marker-style)     |   `'*'`      |

## Дополнительные ссылки

* [`AST Explorer`](https://astexplorer.net)
* [`awesome remark`](https://github.com/remarkjs/awesome-remark)