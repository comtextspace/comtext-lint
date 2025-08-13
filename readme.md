# Comtext-lint

Консольная утилита для проверки формата [`Comtext`](https://research.comtext.space/format-comtext.html).

## Установка

```
yarn install
```

## Запуск

```
yarn process [`path`]
```

Вместо `[`path`]` может быть путь к файлу или каталогу. Утилита проверит файл или файлы в каталоге с расширениями `.md` и `.ct`.

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