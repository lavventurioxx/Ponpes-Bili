import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Supabase environment variables are not configured.');
}

const configuredSupabaseUrl = supabaseUrl;
const configuredSupabaseKey = supabasePublishableKey;

export const supabase = createClient(configuredSupabaseUrl, configuredSupabaseKey);

export function uploadPublicImage(file: File, folder: string, onProgress?: (progress: number) => void) {
  if (!file.type.startsWith('image/')) {
    throw new Error('File harus berupa gambar.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filePath = `${folder}/${crypto.randomUUID()}-${safeFileName}`;

  return new Promise<string>((resolve, reject) => {
    const request = new XMLHttpRequest();
    const timeout = window.setTimeout(() => {
      request.abort();
      reject(new Error('Upload terlalu lama. Periksa koneksi dan policy bucket Supabase.'));
    }, 60_000);

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error('Tidak dapat terhubung ke Supabase Storage.'));
    };
    request.onabort = () => window.clearTimeout(timeout);
    request.onload = () => {
      window.clearTimeout(timeout);
      if (request.status < 200 || request.status >= 300) {
        let message = 'Supabase menolak upload gambar.';
        try {
          const response = JSON.parse(request.responseText) as { message?: string; error?: string };
          message = response.message || response.error || message;
        } catch {
          // Keep the generic message when Supabase does not return JSON.
        }
        reject(new Error(`${message} Pastikan policy INSERT bucket media sudah dibuat.`));
        return;
      }

      resolve(`${configuredSupabaseUrl}/storage/v1/object/public/media/${filePath.split('/').map(encodeURIComponent).join('/')}`);
    };

    request.open('POST', `${configuredSupabaseUrl}/storage/v1/object/media/${filePath.split('/').map(encodeURIComponent).join('/')}`);
    request.setRequestHeader('Authorization', `Bearer ${configuredSupabaseKey}`);
    request.setRequestHeader('apikey', configuredSupabaseKey);
    request.setRequestHeader('Content-Type', file.type);
    request.setRequestHeader('x-upsert', 'false');
    request.send(file);
  });
}

export function uploadPrivateDocument(file: File, userId: string, fieldName: string, onProgress?: (progress: number) => void) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Berkas harus berupa gambar.');
  }

  if (file.size > 1 * 1024 * 1024) {
    throw new Error('Ukuran setiap berkas maksimal 1 MB.');
  }

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filePath = `${userId}/${fieldName}-${crypto.randomUUID()}-${safeFileName}`;

  return new Promise<string>((resolve, reject) => {
    const request = new XMLHttpRequest();
    const timeout = window.setTimeout(() => {
      request.abort();
      reject(new Error('Upload berkas terlalu lama. Periksa koneksi dan policy bucket Supabase pendaftaran.'));
    }, 60_000);

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error('Tidak dapat terhubung ke Supabase Storage.'));
    };
    request.onabort = () => window.clearTimeout(timeout);
    request.onload = () => {
      window.clearTimeout(timeout);
      if (request.status < 200 || request.status >= 300) {
        let message = 'Supabase menolak upload berkas.';
        try {
          const response = JSON.parse(request.responseText) as { message?: string; error?: string };
          message = response.message || response.error || message;
        } catch {
          // Keep the generic message when Supabase does not return JSON.
        }
        reject(new Error(`${message} Pastikan policy INSERT bucket pendaftaran sudah dibuat.`));
        return;
      }
      resolve(filePath);
    };

    const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
    request.open('POST', `${configuredSupabaseUrl}/storage/v1/object/pendaftaran/${encodedPath}`);
    request.setRequestHeader('Authorization', `Bearer ${configuredSupabaseKey}`);
    request.setRequestHeader('apikey', configuredSupabaseKey);
    request.setRequestHeader('Content-Type', file.type);
    request.setRequestHeader('x-upsert', 'false');
    request.send(file);
  });
}

export async function createPrivateDocumentUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const { data, error } = await supabase.storage
    .from('pendaftaran')
    .createSignedUrl(path, 300);

  if (error) throw error;
  return data.signedUrl;
}