import { createHash, timingSafeEqual, randomUUID } from 'node:crypto';
import { DEFAULT_CONTENT, validateContent } from '../shared/content.js';

const CONTENT_PATH = 'landing/content.json';
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export function authorized(header, password) {
  if (!password || password.length < 8 || typeof header !== 'string') return false;
  const hash = text => createHash('sha256').update(text).digest();
  return timingSafeEqual(hash(header), hash(`Bearer ${password}`));
}

export function decodePhoto(value) {
  const match = typeof value === 'string' && value.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) throw new Error('Use uma foto JPEG, PNG ou WebP.');
  const bytes = Buffer.from(match[2], 'base64');
  const type = match[1];
  const valid = type === 'jpeg' ? bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
    : type === 'png' ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (!valid || bytes.length > MAX_PHOTO_BYTES) throw new Error('Foto inválida ou maior que 2 MB.');
  return { bytes, type };
}

// Dependências injetadas permitem testar sem acessar o armazenamento real.
export function createContentHandler({ get, put, password = () => process.env.ADMIN_PASSWORD }) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'PUT'].includes(req.method)) {
      res.setHeader('Allow', 'GET, PUT');
      return res.status(405).json({ error: 'Método não permitido.' });
    }
    if (req.method === 'PUT') {
      const configuredPassword = password();
      if (!configuredPassword || configuredPassword.length < 8) {
        return res.status(503).json({ error: 'Configure ADMIN_PASSWORD no servidor com pelo menos 8 caracteres.' });
      }
      if (!authorized(req.headers.authorization, configuredPassword)) {
        return res.status(401).json({ error: 'Senha de edição incorreta.' });
      }
    }
    let input;
    let photo;
    if (req.method === 'PUT') {
      try {
        if (!req.headers['content-type']?.startsWith('application/json')) throw new Error('Envie JSON.');
        input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        validateContent(input);
        if (input.photoData) photo = decodePhoto(input.photoData);
        if (typeof input.revision !== 'string') throw new Error('Recarregue os dados antes de salvar.');
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    try {
      const stored = await get(CONTENT_PATH, { access: 'private', useCache: false });
      const current = stored ? await new Response(stored.stream).json() : DEFAULT_CONTENT;
      const revision = stored?.blob.etag || '';
      if (req.method === 'GET') return res.status(200).json({ ...current, revision });
      if (input.revision !== revision) {
        return res.status(409).json({ error: 'Outra pessoa alterou os dados. Recarregue antes de salvar.' });
      }
      let photoPath = current.photo;
      if (photo) {
        const uploaded = await put(`landing/photos/${randomUUID()}.${photo.type}`, photo.bytes, {
          access: 'private', contentType: `image/${photo.type}`, addRandomSuffix: false,
        });
        photoPath = uploaded.pathname;
      }
      const next = { ...validateContent(input), photo: photoPath };
      const saved = await put(CONTENT_PATH, JSON.stringify(next), {
        access: 'private', contentType: 'application/json', addRandomSuffix: false,
        allowOverwrite: Boolean(stored), ...(stored ? { ifMatch: revision } : {}),
      });
      return res.status(200).json({ ...next, revision: saved.etag });
    } catch (error) {
      if (error.name === 'BlobPreconditionFailedError' || error.name === 'BlobAlreadyExistsError') {
        return res.status(409).json({ error: 'Os dados mudaram. Recarregue antes de salvar.' });
      }
      const message = String(error.message || '');
      let detail = 'Confira a configuração da Vercel.';
      if (/403|forbidden|unauthorized|token/i.test(message)) {
        detail = 'O Blob recusou as credenciais usadas pelo servidor.';
      }
      if (/No blob credentials found/i.test(message)) {
        detail = 'As credenciais do Blob não foram carregadas no servidor.';
      }
      return res.status(503).json({ error: `Não foi possível acessar o armazenamento. ${detail}` });
    }
  };
}
