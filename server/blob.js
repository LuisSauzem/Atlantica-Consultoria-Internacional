import { loadEnvFile } from 'node:process';
import { get, put } from '@vercel/blob';

// O runtime local das Functions pode não receber as variáveis carregadas pelo Vite.
// Em deployments, as variáveis continuam sendo fornecidas exclusivamente pela Vercel.
if (!['production', 'preview'].includes(process.env.VERCEL_ENV)) {
  try { loadEnvFile('.env.local'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

const credentials = () => process.env.BLOB_READ_WRITE_TOKEN
  ? { token: process.env.BLOB_READ_WRITE_TOKEN }
  : {};

export const getBlob = (path, options) => get(path, { ...options, ...credentials() });
export const putBlob = (path, body, options) => put(path, body, { ...options, ...credentials() });
