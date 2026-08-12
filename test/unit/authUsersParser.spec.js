import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseAuthUsers } from '../../src/authUsersParser.js';

test('retorna null quando AUTH_USERS ausente/vazio', () => {
  assert.equal(parseAuthUsers(''), null);
  assert.equal(parseAuthUsers(null), null);
  assert.equal(parseAuthUsers(undefined), null);
});

test('retorna null quando nao ha ":"', () => {
  assert.equal(parseAuthUsers('admin123'), null);
});

test('parseia usuario unico user:pass', () => {
  assert.deepEqual(parseAuthUsers('admin:123'), { admin: '123' });
});

test('parseia multiplos usuarios separados por virgula', () => {
  assert.deepEqual(parseAuthUsers('admin:123,other:421'), {
    admin: '123',
    other: '421',
  });
});

test('ignora espacos em branco ao redor de user e pass', () => {
  assert.deepEqual(parseAuthUsers(' admin : 123 , other : 421 '), {
    admin: '123',
    other: '421',
  });
});

test('senha pode conter ":" (primeiro : e o delimitador)', () => {
  assert.deepEqual(parseAuthUsers('admin:p@ss:word'), { admin: 'p@ss:word' });
});

test('virgula quebra em multiplos users; segundo sem ":" e invalido', () => {
  // "a:b,c" -> ["a:b", "c"] -> "c" sem ":" e filtrado
  assert.deepEqual(parseAuthUsers('a:b,c'), { a: 'b' });
});

test('user vazio apos trim e invalido', () => {
  assert.equal(parseAuthUsers(':123'), null);
});
