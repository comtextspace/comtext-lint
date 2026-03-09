import path from 'path';
import fs from 'fs';
import os from 'os';

import { checkFile } from '../source/lint.js';

const FIXTURES_PATH = path.join('test', 'fixtures');

describe('checkFile', () => {

  it('lint 1-test.md — файл без ошибок', () => {
    const fixturePath = path.join(FIXTURES_PATH, '1-test.md');
    const messages = checkFile(fixturePath);
    expect(messages).toEqual([]);
  });

  it('lint 2-empty.md — пустой файл без ошибок', () => {
    const fixturePath = path.join(FIXTURES_PATH, '2-empty.md');
    const messages = checkFile(fixturePath);
    expect(messages).toEqual([]);
  });

  it('lint 3-complex.md — 4 ошибки с корректными полями', () => {
    const fixturePath = path.join(FIXTURES_PATH, '3-complex.md');
    const messages = checkFile(fixturePath);

    // Должно быть 4 ошибки
    expect(messages).toHaveLength(4);

    // Каждое сообщение содержит нужные поля
    messages.forEach(msg => {
      expect(msg).toMatchObject({
        line: expect.any(Number),
        column: expect.any(Number),
        reason: expect.any(String),
      });
    });

    const reasons = messages.map(m => m.reason);
    expect(reasons).toContain('Frontmatter is missing required field: title');
    expect(reasons).toContain('Frontmatter is missing required field: version');
    expect(reasons.some(r => r.includes('blank lines between nodes'))).toBe(true);
    expect(reasons.some(r => r.includes('final newline'))).toBe(true);
  });

  it('should ignore file without format: comtext in frontmatter', () => {
    const fixturePath = path.join(FIXTURES_PATH, '4-no-comtext.md');
    const messages = checkFile(fixturePath);
    // Файлы без format: comtext должны игнорироваться
    expect(messages).toBeNull();
  });

  it('should ignore file without frontmatter', () => {
    const tmpPath = path.join(os.tmpdir(), '5-no-frontmatter.md');
    const content = '# Заголовок\n\nТекст без фронтматтера\n';

    fs.writeFileSync(tmpPath, content, 'utf8');

    try {
      const messages = checkFile(tmpPath);
      // Файлы без фронтматтера должны игнорироваться
      expect(messages).toBeNull();
    } finally {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  });

  it('should check heading max level (check 7)', () => {
    const fixturePath = path.join(FIXTURES_PATH, '7-heading-max-level.md');
    const messages = checkFile(fixturePath);

    // Стандартное правило remark-lint-no-heading-like-paragraph ловит уровень 7
    expect(messages.some(m => m.reason.includes('hashes starting paragraph looking like a heading'))).toBe(true);
  });

  it('should check emphasis whole phrase (check 29)', () => {
    const fixturePath = path.join(FIXTURES_PATH, '29-emphasis-whole-phrase.md');
    const messages = checkFile(fixturePath);

    // Должно быть несколько ошибок для раздельных выделений
    expect(messages.length).toBeGreaterThanOrEqual(3);

    const reasons = messages.map(m => m.reason);
    expect(reasons.some(r => r.includes('Multiple bold markers should be combined'))).toBe(true);
    expect(reasons.some(r => r.includes('Multiple emphasis markers should be combined'))).toBe(true);
    expect(reasons.some(r => r.includes('Multiple strong emphasis markers should be combined'))).toBe(true);
  });

});
