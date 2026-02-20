// remark-lint-emphasis-whole-phrase.js
import { lintRule } from 'unified-lint-rule';

const PLUGIN_NAME = 'remark-lint:emphasis-whole-phrase';

const remarkLintEmphasisWholePhrase = lintRule(
  {
    origin: PLUGIN_NAME
  },
  /**
   * @param {import('mdast').Root} tree
   * @param {import('vfile').VFile} file
   * @returns {void}
   */
  function (tree, file) {
    const value = String(file);
    const lines = value.split(/\r?\n/);

    // Ищем паттерны вида **слово1** **слово2** или *слово1* *слово2*
    // в одной строке
    lines.forEach((line, lineIndex) => {
      // Проверяем полужирный: **слово1** **слово2**
      const boldPattern = /\*\*([^*]+)\*\*\s+\*\*([^*]+)\*\*/g;
      let match;
      while ((match = boldPattern.exec(line)) !== null) {
        const startColumn = match.index + 1;
        file.message(
          `Multiple bold markers should be combined: use **${match[1]} ${match[2]}** instead of **${match[1]}** **${match[2]}**`,
          {
            line: lineIndex + 1,
            column: startColumn
          }
        );
      }

      // Проверяем курсив: *слово1* *слово2* (но не **слово**)
      // Используем негативный lookbehind и lookahead чтобы не ловить **
      const emphasisPattern = /(?<!\*)\*([^*\s][^*]*[^*\s])\*\s+\*([^*\s][^*]*[^*\s])\*(?!\*)/g;
      while ((match = emphasisPattern.exec(line)) !== null) {
        const startColumn = match.index + 1;
        file.message(
          `Multiple emphasis markers should be combined: use *${match[1]} ${match[2]}* instead of *${match[1]}* *${match[2]}*`,
          {
            line: lineIndex + 1,
            column: startColumn
          }
        );
      }

      // Проверяем комбинированное: ***слово1*** ***слово2***
      const strongEmphasisPattern = /\*\*\*([^*]+)\*\*\*\s+\*\*\*([^*]+)\*\*\*/g;
      while ((match = strongEmphasisPattern.exec(line)) !== null) {
        const startColumn = match.index + 1;
        file.message(
          `Multiple strong emphasis markers should be combined: use ***${match[1]} ${match[2]}*** instead of ***${match[1]}*** ***${match[2]}***`,
          {
            line: lineIndex + 1,
            column: startColumn
          }
        );
      }
    });
  }
);

export default remarkLintEmphasisWholePhrase;
