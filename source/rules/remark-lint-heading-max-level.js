// remark-lint-heading-max-level.js
import { lintRule } from 'unified-lint-rule';
import { visit } from 'unist-util-visit';

const PLUGIN_NAME = 'remark-lint:heading-max-level';
const MAX_LEVEL = 6;

const remarkLintHeadingMaxLevel = lintRule(
  {
    origin: PLUGIN_NAME
  },
  /**
   * @param {import('mdast').Root} tree
   * @param {import('vfile').VFile} file
   * @returns {void}
   */
  function (tree, file) {
    visit(tree, 'heading', (node) => {
      if (node.depth > MAX_LEVEL) {
        file.message(
          `Heading level ${node.depth} exceeds maximum allowed level of ${MAX_LEVEL}`,
          node
        );
      }
    });
  }
);

export default remarkLintHeadingMaxLevel;
