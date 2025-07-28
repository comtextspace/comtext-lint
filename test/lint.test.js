import path from 'path';
import fs from 'fs';

import { jest } from '@jest/globals';
import { color } from 'vfile-reporter/do-not-use-color';

const { checkFile } = await import('../source/lint.js');

const FIXTURES_PATH = path.join('test', 'fixtures');

describe('checkFile', () => {
    let consoleSpy;
    let originalLog;
  
    beforeAll(() => {
      originalLog = console.log;
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
  
    beforeEach(() => {
      consoleSpy.mockClear();
    });
  
    afterAll(() => {
      consoleSpy.mockRestore();
    });

  it('lint 1-test.md', () => {
    const fixturePath = path.join(FIXTURES_PATH, '1-test.md');
    const logPath = path.join(FIXTURES_PATH, '1-test.md.log');
    
    checkFile(fixturePath);

    const actualOutput = consoleSpy.mock.calls.flat().join('\n');
    const expectedOutput = fs.readFileSync(logPath, 'utf8');
    
    expect(actualOutput).toBe(expectedOutput.trim());
  });

  it('lint 2-empty.md', () => {
    const fixturePath = path.join(FIXTURES_PATH, '2-empty.md');
    const logPath = path.join(FIXTURES_PATH, '2-empty.md.log');
    
    checkFile(fixturePath);

    const actualOutput = consoleSpy.mock.calls.flat().join('\n');
    const expectedOutput = fs.readFileSync(logPath, 'utf8');
    
    expect(actualOutput).toBe(expectedOutput.trim());
  });

  it('lint 3-complex.md', () => {
    const fixturePath = path.join(FIXTURES_PATH, '3-complex.md');
    const logPath = path.join(FIXTURES_PATH, '3-complex.md.log');
    
    checkFile(fixturePath, {color: false});

    const actualOutput = consoleSpy.mock.calls.flat().join('\n');
    const expectedOutput = fs.readFileSync(logPath, 'utf8');

    expect(actualOutput).toBe(expectedOutput.trim());
  });

});