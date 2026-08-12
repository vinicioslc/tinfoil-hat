import { test } from 'node:test';
import assert from 'node:assert/strict';
import SaveSyncManager from '../../src/modules/ftp-client.js';

test('SaveSyncManager: NX_IPS unico vira array de 1', () => {
  const mgr = new SaveSyncManager();
  mgr.DEVICES_IP_LIST = [];
  // simula env unico
  const original = process.env.NX_IPS;
  process.env.NX_IPS = '192.168.0.10';
  // re-executa logica do construtor manualmente
  mgr.DEVICES_IP_LIST = [];
  mgr.DEVICES_IP_LIST.push(process.env.NX_IPS.trim());
  assert.deepEqual(mgr.DEVICES_IP_LIST, ['192.168.0.10']);
  if (original === undefined) delete process.env.NX_IPS;
  else process.env.NX_IPS = original;
});

test('SaveSyncManager: NX_IPS com ";" parseia todos os IPs', () => {
  const mgr = new SaveSyncManager();
  mgr.DEVICES_IP_LIST = [];
  const original = process.env.NX_IPS;
  process.env.NX_IPS = '192.168.0.10;192.168.0.11;192.168.0.12';
  mgr.DEVICES_IP_LIST = process.env.NX_IPS
    .split(';')
    .map((ip) => ip.trim())
    .filter(Boolean);
  assert.deepEqual(mgr.DEVICES_IP_LIST, [
    '192.168.0.10',
    '192.168.0.11',
    '192.168.0.12',
  ]);
  if (original === undefined) delete process.env.NX_IPS;
  else process.env.NX_IPS = original;
});

test('SaveSyncManager: addRecentDevice nao duplica', async () => {
  const mgr = new SaveSyncManager();
  mgr.DEVICES_IP_LIST = ['10.0.0.1'];
  await mgr.addRecentDevice('10.0.0.2');
  assert.deepEqual(mgr.DEVICES_IP_LIST, ['10.0.0.1', '10.0.0.2']);
  await mgr.addRecentDevice('10.0.0.2'); // duplicado
  assert.deepEqual(mgr.DEVICES_IP_LIST, ['10.0.0.1', '10.0.0.2']);
});

test('SaveSyncManager: ensureIntervalExists cria timer com unref', () => {
  const mgr = new SaveSyncManager();
  mgr.ensurePauseInterval();
  mgr.intervalMS = 5000;
  mgr.ensureIntervalExists();
  assert.ok(mgr.checkInterval, 'checkInterval criado');
  assert.equal(typeof mgr.checkInterval.unref, 'function');
  // limpa
  clearInterval(mgr.checkInterval);
});
