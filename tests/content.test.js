import test from 'node:test';
import assert from 'node:assert/strict';
import { createContentHandler, decodePhoto, authorized } from '../server/content-handler.js';
import { DEFAULT_CONTENT, initials } from '../shared/content.js';

const password = 'test-only-password-with-32-characters';
test('aceita senha de 8 caracteres e rejeita senha incorreta ou configuração curta', () => {
  const valid = 'test-123';
  assert.equal(valid.length, 8);
  assert.equal(authorized(`Bearer ${valid}`, valid), true);
  assert.equal(authorized('Bearer incorrect', valid), false);
  assert.equal(authorized('Bearer test-12', 'test-12'), false);
  assert.equal(authorized('Bearer undefined', undefined), false);
});
function setup({ stored = null, writeError = null } = {}) {
  const writes = [];
  const handler = createContentHandler({
    password: () => password,
    get: async () => stored && ({ stream: new Response(JSON.stringify(stored)).body, blob: { etag: 'v1' } }),
    put: async (path, body, options) => {
      writes.push({ path, body, options });
      if (writeError) throw writeError;
      return { pathname: path, etag: 'v2' };
    },
  });
  const invoke = async (body, authorization = `Bearer ${password}`, method = 'PUT') => {
    const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
    await handler({ method, headers: { authorization, 'content-type': 'application/json' }, body }, res);
    return res;
  };
  return { writes, invoke };
}

test('leitura inicial retorna conteúdo original sem gravar', async () => {
  const { invoke, writes } = setup();
  const res = await invoke(null, '', 'GET');
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.names, DEFAULT_CONTENT.names);
  assert.equal(writes.length, 0);
});

test('senha incorreta não grava; campos inválidos não gravam', async () => {
  const { invoke, writes } = setup();
  assert.equal((await invoke(DEFAULT_CONTENT, 'Bearer wrong')).code, 401);
  assert.equal((await invoke({ ...DEFAULT_CONTENT, names: [], revision: '' })).code, 400);
  assert.equal(writes.length, 0);
});

test('grava somente campos permitidos e preserva foto existente', async () => {
  const current = { ...DEFAULT_CONTENT, photo: 'landing/photos/existing.jpeg' };
  const { invoke, writes } = setup({ stored: current });
  const names = [...DEFAULT_CONTENT.names];
  names[0] = 'Nova Presidente';
  const res = await invoke({ names, phone: '(51) 99999-0000', revision: 'v1', email: 'alterado@example.com', photo: 'arbitrary' });
  assert.equal(res.code, 200);
  assert.deepEqual(JSON.parse(writes[0].body), { names, phone: '(51) 99999-0000', photo: current.photo });
  assert.equal(writes[0].options.ifMatch, 'v1');
});

test('foto nova é armazenada antes da referência e leitura posterior recupera os dados', async () => {
  const { invoke, writes } = setup();
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9WQAAAAASUVORK5CYII=';
  const res = await invoke({ ...DEFAULT_CONTENT, revision: '', photoData: png });
  assert.equal(res.code, 200);
  assert.equal(writes.length, 2);
  assert.equal(JSON.parse(writes[1].body).photo, writes[0].path);
  const saved = setup({ stored: JSON.parse(writes[1].body) });
  const loaded = await saved.invoke(null, '', 'GET');
  assert.equal(loaded.body.photo, writes[0].path);
});

test('rejeita imagem falsa, SVG e arquivo acima de 2 MB', () => {
  assert.throws(() => decodePhoto('data:image/png;base64,YWJj'));
  assert.throws(() => decodePhoto('data:image/svg+xml;base64,YWJj'));
  const bytes = Buffer.alloc(2 * 1024 * 1024 + 1);
  Buffer.from([255, 216, 255]).copy(bytes);
  assert.throws(() => decodePhoto(`data:image/jpeg;base64,${bytes.toString('base64')}`));
});

test('edições concorrentes e falha de armazenamento não retornam sucesso', async () => {
  const stale = setup({ stored: DEFAULT_CONTENT });
  assert.equal((await stale.invoke({ ...DEFAULT_CONTENT, revision: 'old' })).code, 409);
  assert.equal(stale.writes.length, 0);
  const conflict = setup({ stored: DEFAULT_CONTENT, writeError: { name: 'BlobPreconditionFailedError' } });
  assert.equal((await conflict.invoke({ ...DEFAULT_CONTENT, revision: 'v1' })).code, 409);
  const failed = setup({ writeError: new Error('storage unavailable') });
  assert.equal((await failed.invoke({ ...DEFAULT_CONTENT, revision: '' })).code, 503);
});

test('iniciais acompanham o novo nome', () => {
  assert.equal(initials(' Maria da Silva '), 'MS');
  assert.equal(initials('Ana'), 'A');
});
