// plugins/remark-lint-frontmatter-required-fields.js
import { lintRule } from 'unified-lint-rule';
import { visit } from 'unist-util-visit';
import jsYaml from 'js-yaml';

const PLUGIN_NAME = 'remark-lint:frontmatter-required-fields';

// Список обязательных полей
const REQUIRED_FIELDS = ['title', 'version', 'author', 'format'];

const remarkLintFrontmatterRequiredFields = lintRule(
  {
    origin: PLUGIN_NAME
  },
  /**
   * @param {import('mdast').Root} tree
   * @param {import('vfile').VFile} file
   * @returns {void}
   */
  function (tree, file) {
    let frontmatter;

    visit(tree, 'yaml', (node) => {
      if (!frontmatter) {
        frontmatter = node;
      }
    });

    if (frontmatter) {
      try {
        const data = jsYaml.load(frontmatter.value);

        if (!data || typeof data !== 'object') {
          file.message('Frontmatter is not a valid object', frontmatter);
          return;
        }

        // ✅ Автоматическая проверка всех полей из массива
        const missingFields = REQUIRED_FIELDS.filter((field) => !(field in data));

        missingFields.forEach((field) => {
          file.message(`Frontmatter is missing required field: ${field}`, frontmatter);
        });
      } catch (err) {
        file.message(`Invalid YAML in frontmatter: ${err.message}`, frontmatter);
      }
    } else {
      file.message(
        `Missing frontmatter: expected YAML frontmatter with fields: ${REQUIRED_FIELDS.join(', ')}`
      );
    }
  }
);

export default remarkLintFrontmatterRequiredFields;