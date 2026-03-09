// remark-lint-emphasis-whole-phrase.js
import { lintRule } from 'unified-lint-rule';
import { visit } from 'unist-util-visit';

const PLUGIN_NAME = 'remark-lint:emphasis-whole-phrase';

/**
 * Извлекает текстовое содержимое AST-узла (рекурсивно по children).
 *
 * @param {import('mdast').PhrasingContent} node
 * @returns {string}
 */
function nodeText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(nodeText).join('');
  return '';
}

/**
 * Возвращает тип выделения узла:
 * - 'strong'         для **text**
 * - 'emphasis'       для *text*
 * - 'strongEmphasis' для ***text*** (emphasis > strong)
 * - null             для всего остального
 *
 * @param {import('mdast').PhrasingContent} node
 * @returns {'strong' | 'emphasis' | 'strongEmphasis' | null}
 */
function emphasisType(node) {
  if (node.type === 'strong') {
    return 'strong';
  }
  if (node.type === 'emphasis') {
    // ***text*** парсится как emphasis > strong
    if (node.children.length === 1 && node.children[0].type === 'strong') {
      return 'strongEmphasis';
    }
    return 'emphasis';
  }
  return null;
}

const TYPE_META = {
  strong:         { marker: '**',  label: 'bold' },
  emphasis:       { marker: '*',   label: 'emphasis' },
  strongEmphasis: { marker: '***', label: 'strong emphasis' },
};

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
    // Обходим только параграфы — код, заголовки и прочее не затрагиваем
    visit(tree, 'paragraph', (paragraph) => {
      const children = paragraph.children;

      for (let i = 0; i + 2 < children.length; i++) {
        const nodeA = children[i];
        const sep   = children[i + 1];
        const nodeB = children[i + 2];

        // Разделитель должен быть текстовым узлом только из пробелов
        if (sep.type !== 'text' || sep.value.trim() !== '') continue;

        const typeA = emphasisType(nodeA);
        const typeB = emphasisType(nodeB);

        // Оба узла должны быть одного типа выделения
        if (!typeA || typeA !== typeB) continue;

        const { marker, label } = TYPE_META[typeA];
        const textA = nodeText(nodeA);
        const textB = nodeText(nodeB);

        file.message(
          `Multiple ${label} markers should be combined: ` +
          `use ${marker}${textA} ${textB}${marker} ` +
          `instead of ${marker}${textA}${marker} ${marker}${textB}${marker}`,
          nodeA
        );
      }
    });
  }
);

export default remarkLintEmphasisWholePhrase;
