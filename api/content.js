import { getBlob, putBlob } from '../server/blob.js';
import { createContentHandler } from '../server/content-handler.js';

export default createContentHandler({
  get: getBlob,
  put: putBlob,
});
