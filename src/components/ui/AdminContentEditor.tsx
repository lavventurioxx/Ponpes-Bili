"use client";

import { useState } from 'react';

type ContentItem = Record<string, string>;

type AdminContentEditorProps = {
  title: string;
  items: ContentItem[];
  fields: { key: string; label: string; multiline?: boolean; image?: boolean; options?: string[] }[];
  onSave: (items: ContentItem[]) => Promise<void>;
  onImageChange?: (index: number, key: string, file: File, onProgress?: (progress: number) => void) => Promise<string>;
  onClose: () => void;
};

export default function AdminContentEditor({ title, items, fields, onSave, onImageChange, onClose }: AdminContentEditorProps) {
  const [draft, setDraft] = useState(items);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const update = (index: number, key: string, value: string) => {
    setDraft((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(draft);
      onClose();
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
      setError(code === 'permission-denied'
        ? 'Akun ini belum memiliki izin admin di Firestore.'
        : 'Gagal menyimpan. Periksa Firebase Rules dan koneksi internet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4">
      <form onSubmit={submit} className="mx-auto my-8 max-w-3xl space-y-5 rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-500">Tutup</button>
        </div>
        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {draft.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border p-4">
            {fields.map((field, fieldIndex) => field.image ? (
              <div key={`${field.key}-${fieldIndex}`} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{field.label}</label>
                <input type="file" accept="image/*" disabled={uploadingKey !== null} onChange={async (event) => { const file = event.target.files?.[0]; if (!file || !onImageChange) return; const currentKey = `${index}-${field.key}-${fieldIndex}`; setUploadingKey(currentKey); setUploadProgress(0); setError(''); try { update(index, field.key, await onImageChange(index, field.key, file, setUploadProgress)); } catch (uploadError: unknown) { const code = typeof uploadError === 'object' && uploadError !== null && 'code' in uploadError ? String(uploadError.code) : ''; const message = uploadError instanceof Error ? uploadError.message : ''; setError(code === 'storage/unauthorized' ? 'Upload ditolak. Pastikan bucket Supabase media memiliki policy INSERT.' : message || 'Gagal mengunggah gambar ke Supabase Storage. Periksa bucket media, policy INSERT, tipe file, dan ukuran maksimal 5 MB.'); } finally { setUploadingKey(null); setUploadProgress(0); } }} className="w-full rounded-lg border px-3 py-2" />
                {uploadingKey === `${index}-${field.key}-${fieldIndex}` && <p className="text-xs font-semibold text-amber-600">Mengunggah gambar... {uploadProgress}%</p>}
                {item[field.key] && <img src={item[field.key]} alt="Preview gambar" className="h-24 w-32 rounded-lg object-cover" />}
              </div>
            ) : field.options ? (
              <select key={`${field.key}-${fieldIndex}`} required value={item[field.key] || ''} onChange={(event) => update(index, field.key, event.target.value)} className="w-full rounded-lg border bg-white px-3 py-2">
                <option value="">Pilih {field.label.toLowerCase()}</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.multiline ? (
              <textarea key={`${field.key}-${fieldIndex}`} required value={item[field.key] || ''} onChange={(event) => update(index, field.key, event.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2" placeholder={field.label} />
            ) : (
              <input key={`${field.key}-${fieldIndex}`} required value={item[field.key] || ''} onChange={(event) => update(index, field.key, event.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder={field.label} />
            ))}
            <button type="button" onClick={() => setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-semibold text-red-600">Hapus item</button>
          </div>
        ))}
        <div className="flex justify-between">
          <button type="button" onClick={() => setDraft((current) => [...current, {}])} className="rounded-lg border border-emerald-700 px-4 py-2 font-bold text-emerald-700">Tambah item</button>
          <button disabled={saving || uploadingKey !== null} className="rounded-lg bg-emerald-700 px-5 py-2 font-bold text-white">{saving ? 'Menyimpan...' : uploadingKey !== null ? 'Menunggu upload...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
