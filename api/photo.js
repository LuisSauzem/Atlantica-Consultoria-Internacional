import { getBlob } from '../server/blob.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const path = req.query.path;
  if (typeof path !== 'string' || !/^landing\/photos\/[a-f0-9-]{36}\.(jpeg|png|webp)$/.test(path)) {
    return res.status(400).end();
  }
  try {
    const photo = await getBlob(path, {
      access: 'private',
    });
    if (!photo) return res.status(404).end();
    res.setHeader('Content-Type', photo.blob.contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.status(200).send(Buffer.from(await new Response(photo.stream).arrayBuffer()));
  } catch {
    return res.status(503).end();
  }
}
