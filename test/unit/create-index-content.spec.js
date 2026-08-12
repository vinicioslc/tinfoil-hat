import { test } from 'node:test';
import assert from 'node:assert/strict';

import generateIndex from '../../src/create-index-content.js';
import { romsDirPath } from '../../src/helpers/envs.js';
import path from 'path';
import fs from 'fs';

test('generateIndex: retorna files e directories', async () => {
  const result = await generateIndex();
  assert.ok(result, 'result existe');
  assert.ok(Array.isArray(result.files), 'files e array');
  assert.ok(Array.isArray(result.directories), 'directories e array');
});

test('generateIndex: cache retorna mesma referencia em <2s', async () => {
  const a = await generateIndex();
  const b = await generateIndex();
  assert.equal(a, b, 'deve vir do cache (mesma referencia)');
});

test('generateIndex: arquivo de teste aparece em files', async () => {
  // limpa cache forçando espera
  await new Promise((r) => setTimeout(r, 2100));
  const tmp = path.join(romsDirPath, '__idx_test__.nsz');
  fs.mkdirSync(romsDirPath, { recursive: true });
  fs.writeFileSync(tmp, 'x');
  const result = await generateIndex();
  const found = result.files.some((f) => f.url.includes('__idx_test__'));
  fs.unlinkSync(tmp);
  assert.ok(found, 'arquivo de teste deve aparecer no index');
});
