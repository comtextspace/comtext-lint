import path from 'path';

import { jest } from '@jest/globals';

const { checkFile } = await import('../source/lint.js');

const FIXTURES_PATH = path.join('test', 'fixtures');

describe('checkFile', () => {
    let consoleErrorSpy;
  
    beforeAll(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });
  
    beforeEach(() => {
      consoleErrorSpy.mockClear();
    });
  
    afterAll(() => {
      consoleErrorSpy.mockRestore();
    });

  it('lint 1-test.md', () => {
    const fixturePath = path.join(FIXTURES_PATH, '1-test.md');
    
    checkFile(fixturePath);

    // Для файлов без ошибок console.error не вызывается
    const actualOutput = consoleErrorSpy.mock.calls.flat().join('\n');
    
    expect(actualOutput).toBe('');
  });

  it('lint 2-empty.md', () => {
    const fixturePath = path.join(FIXTURES_PATH, '2-empty.md');
    
    checkFile(fixturePath);

    // Для файлов без ошибок console.error не вызывается
    const actualOutput = consoleErrorSpy.mock.calls.flat().join('\n');
    
    expect(actualOutput).toBe('');
  });

  it('lint 3-complex.md', () => {
    const fixturePath = path.join(FIXTURES_PATH, '3-complex.md');
    
    checkFile(fixturePath, {color: false});

    const actualOutput = consoleErrorSpy.mock.calls.flat().join('\n');
    
    // Проверяем точный формат вывода: file:line:col: message
    const lines = actualOutput.split('\n').filter(line => line.trim());
    
    // Должно быть 4 ошибки
    expect(lines.length).toBe(4);
    
    // Проверяем формат каждой строки: file:line:col: message
    lines.forEach(line => {
      expect(line).toMatch(/^test\/fixtures\/3-complex\.md:\d+:\d+:/);
    });
    
    // Проверяем, что все ожидаемые ошибки присутствуют
    expect(actualOutput).toContain('Frontmatter is missing required field: title');
    expect(actualOutput).toContain('Frontmatter is missing required field: version');
    expect(actualOutput).toContain('Unexpected `0` blank lines between nodes');
    expect(actualOutput).toContain('Unexpected missing final newline character');
  });

});