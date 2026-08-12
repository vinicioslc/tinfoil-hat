import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  addRelativeStartPath,
  addFileInfoToPath,
  getJsonTemplateFile,
  stringNormalizer,
} from '../../src/helpers/helpers.js';
import { romsDirPath, jsonTemplatePath } from '../../src/helpers/envs.js';
import path from 'path';
import fs from 'fs';

test('stringNormalizer: converte colchetes e parenteses', () => {
  assert.equal(
    stringNormalizer('File [NSZ] (v0).nsz'),
    'File %5BNSZ%5D %28v0%29.nsz'
  );
});

test('stringNormalizer: converte = + , ; e barras', () => {
  assert.equal(stringNormalizer('a=b+c,d;e/f\\g'), 'a%3Db%2Bc%2Cd%3Be%2Ff%5Cg');
});

test('stringNormalizer: retorna valor original se vazio/undefined', () => {
  assert.equal(stringNormalizer(''), '');
  assert.equal(stringNormalizer(null), null);
  assert.equal(stringNormalizer(undefined), undefined);
});

test('addRelativeStartPath: prefixa url com ../', () => {
  const r = addRelativeStartPath({ url: 'games/file.nsz' });
  assert.equal(r.url, '../games/file.nsz');
});

test('getJsonTemplateFile: le o template shop_template.jsonc', () => {
  const tpl = getJsonTemplateFile();
  assert.ok(tpl && typeof tpl === 'object');
});

test('addFileInfoToPath: adiciona size baseado no arquivo real', async () => {
  // cria arquivo temporario em romsDirPath
  const tmp = path.join(romsDirPath, '__test_tmp_file__.txt');
  fs.writeFileSync(tmp, 'hello');
  const r = await addFileInfoToPath('../__test_tmp_file__.txt');
  assert.equal(r.size, 5);
  fs.unlinkSync(tmp);
});
