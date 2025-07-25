import fs from 'fs';
import path from 'path';

import { remark } from 'remark';
import remarkLint from 'remark-lint';
import { reporter } from 'vfile-reporter';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation';
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style';
import remarkLintCorrectMediaSyntax from 'remark-lint-correct-media-syntax';
import remarkLintFencedCodeMarker from 'remark-lint-fenced-code-marker';
import remarkLintFinalNewline from 'remark-lint-final-newline';
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level';
import remarkLintHardBreakSpaces from 'remark-lint-hard-break-spaces';
import remarkLintHeadingIncrement from 'remark-lint-heading-increment';
import remarkLintHeadingStyle from 'remark-lint-heading-style';
import remarkLintLinebreakStyle from 'remark-lint-linebreak-style';
import remarkLintListItemBulletIndent from 'remark-lint-list-item-bullet-indent';
import remarkLintListItemContentIndent from 'remark-lint-list-item-content-indent';
import remarkLintListItemIndent from 'remark-lint-list-item-indent';
import remarkLintMediaStyle from 'remark-lint-media-style';
import remarkLintNoBlockquoteWithoutMarker from 'remark-lint-no-blockquote-without-marker';
import remarkLintNoConsecutiveBlankLines from 'remark-lint-no-consecutive-blank-lines';
import remarkLintNoEmptyUrl from 'remark-lint-no-empty-url';
import remarkLintNoHeadingContentIndent from 'remark-lint-no-heading-content-indent'
import remarkLintNoHeadingIndent from 'remark-lint-no-heading-indent';
import remarkLintNoHeadingLikeParagraph from 'remark-lint-no-heading-like-paragraph';
import remarkLintNoHeadingPunctuation from 'remark-lint-no-heading-punctuation';
import remarkLintNoHiddenTableCell from 'remark-lint-no-hidden-table-cell';
import remarkLintNoHtml from 'remark-lint-no-html';
import remarkLintNoMissingBlankLines from 'remark-lint-no-missing-blank-lines';
import remarkLintNoMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings';
import remarkLintNoParagraphContentIndent from 'remark-lint-no-paragraph-content-indent';
import remarkLintNoTableIndentation from 'remark-lint-no-table-indentation';
import remarkLintNoTabs from 'remark-lint-no-tabs';
import remarkLintNoUnusedDefinitions from 'remark-lint-no-unused-definitions';
import remarkLintRuleStyle from 'remark-lint-rule-style';
import remarkLintUnorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style';

export function checkFile(filePath) {

  if (path.extname(filePath) === '.md') {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileResult = remark()
      .use(remarkGfm)
      .use(remarkFrontmatter)

      // Список проверок с описанием
      // https://github.com/remarkjs/remark-lint
      .use(remarkLint)
      
      // В цитатах текст начинается с третьего символа
      // > текст
      .use(remarkLintBlockquoteIndentation, 2)
      
      // Блок кода обрамляется символами ```, а не 
      // пробелами  
      .use(remarkLintCodeBlockStyle, 'fenced')

      // Ссылки такие [](url) а не такие ()[url]
      .use(remarkLintCorrectMediaSyntax)

      // Символ для обозначения блока кода
      .use(remarkLintFencedCodeMarker, '`')

      .use(remarkLintFinalNewline)
      .use(remarkLintFirstHeadingLevel, 1)

      // Для принудительного перевода строки указано 
      // не больше двух пробелов в конце строки
      .use(remarkLintHardBreakSpaces)

      // Заголовки должны возрастать без пропусков
      .use(remarkLintHeadingIncrement)

      // Заголовки вида
      // # Заголовок
      .use(remarkLintHeadingStyle, 'atx')

      .use(remarkLintLinebreakStyle, 'unix')

      // Отступы слева для списков равны нулю
      .use(remarkLintListItemBulletIndent)

      // Одинаковый отступ у дочерних элементов списков
      .use(remarkLintListItemContentIndent)
      
      // Отступ между маркером списка и содержимым равен 1
      .use(remarkLintListItemIndent, 'one')
      
      // Ссылки должны быть сразу [text](url)]
      // Запрещён такой вариант
      // [Mercury][]
      // [mercury]: https://example.com/mercury/
      .use(remarkLintMediaStyle, 'resource')
      
      // Недопустимы цитаты без маркера цитаты, такие как ниже
      // > цитата
      // тоже цитата
      .use(remarkLintNoBlockquoteWithoutMarker)
      
      // Нет двух пустых строк подряд
      .use(remarkLintNoConsecutiveBlankLines)
      
      // URL для ссылок и изображений должны быть заполнены
      .use(remarkLintNoEmptyUrl)

      .use(remarkLintNoHeadingContentIndent)
      .use(remarkLintNoHeadingIndent)

      // Ограничивает количество хешей в начале строки
      .use(remarkLintNoHeadingLikeParagraph)
      
      // Недопустимые символы в конце заголовков
      .use(remarkLintNoHeadingPunctuation, ',.:;')

      // У строк таблицы должно быть столько же колонок сколько в заголовке
      .use(remarkLintNoHiddenTableCell)
      
      // Запрет HTML в документе
      .use(remarkLintNoHtml)
      
      // Есть пустые строки между блоками документа
      .use(remarkLintNoMissingBlankLines)

      .use(remarkLintNoMultipleToplevelHeadings)
      .use(remarkLintNoParagraphContentIndent)
      .use(remarkLintNoTableIndentation)
      .use(remarkLintNoTabs)
      .use(remarkLintNoUnusedDefinitions)

      .use(remarkLintRuleStyle, '---')

      .use(remarkLintUnorderedListMarkerStyle, '*')

      .processSync(fileContent);

    console.log(`${filePath}`);
    const report = reporter(fileResult);
    console.log(report);
    console.log('------------------------');
  }
};
