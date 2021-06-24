import path from 'path';
import { types } from 'util';
import { dirname } from 'dirname-filename-esm';
import { promises as fs } from 'fs';
export { strict as assert } from 'assert';

export function resolve(meta, ...args) {
  const p = types.isObject(meta) ? dirname(meta) : meta;
  return path.resolve(p, ...args);
}

export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// calc tmp dir by jest test file name
export function getTempDir() {
  // `expect` is auto inject by @jest/globals
  const testPath = expect.getState().testPath;
  const testDir = path.join(process.cwd(), 'test');
  const relativePath = testPath.substring(testDir.length + 1, testPath.lastIndexOf('.test.js'));
  const tmpDir = relativePath.split(path.sep).join('-');
  const tmpDirFullPath = path.join(testDir, '.tmp', tmpDir);
  return tmpDirFullPath;
}

export async function initDir(p) {
  await fs.rm(p, { force: true, recursive: true });
  await fs.mkdir(p, { recursive: true });
}

export const timePlugin = {
  time(label = 'default') {
    return this.tap(() => {
      this.ctx.timeMapping = this.ctx.timeMapping || {};
      this.ctx.timeMapping[label] = Date.now();
    });
  },
  timeEnd(label, fn) {
    if (typeof label === 'function') {
      fn = label;
      label = 'default';
    }
    return this.tap(() => {
      const start = this.ctx.timeMapping[label];
      const now = Date.now();
      const cost = now - start;
      fn(cost, start, now);
    });
  },
};
