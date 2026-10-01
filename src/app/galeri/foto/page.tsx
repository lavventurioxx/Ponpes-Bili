"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminContentEditor from '@/components/ui/AdminContentEditor';
import { uploadPublicImage } from '@/lib/supabase';

const defaultItems = [
  { judul: 'Kegiatan Santri', deskripsi: 'Dokumentasi kegiatan santri.', url: '' },
  { judul: 'Lingkungan Pondok', deskripsi: 'Lingkungan PP Modern Roudlotul Abror.', url: '' },
  { judul: 'Kegiatan Pembelajaran', deskripsi: 'Kegiatan belajar dan mengajar.', url: '' },
];

export default function GaleriFotoPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState(defaultItems);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'content', 'galeri_foto')).then((snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) setItems(snapshot.data().items);
    }).catch(() => undefined);
  }, []);

  const saveItems = async (nextItems: Record<string, string>[]) => {
    await setDoc(doc(db, 'content', 'galeri_foto'), { items: nextItems });
    setItems(nextItems as typeof defaultItems);
  };

  const uploadImage = async (_index: number, _key: string, file: File, onProgress?: (progress: number) => void) => uploadPublicImage(file, 'galeri', onProgress);

  return (
    <>
      <section className="bg-emerald-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Galeri Foto</h1>
          <p className="text-emerald-100">Dokumentasi kegiatan PP Modern Roudlotul Abror</p>
          {isAdmin && <button onClick={() => setEditing(true)} className="mt-6 rounded-lg bg-amber-500 px-5 py-2.5 font-bold text-emerald-950">Edit Galeri Foto</button>}
        </div>
      </section>
      <section className="min-h-[60vh] bg-white py-20">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-3">
          {items.map((item) => <article key={`${item.judul}-${item.url}`} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm"><div className="flex h-56 items-center justify-center bg-gray-200 p-4 text-center text-gray-500">{item.url ? <img src={item.url} alt={item.judul} className="h-full w-full object-cover" /> : <span>Foto {item.judul}</span>}</div><div className="p-5"><h2 className="font-bold text-emerald-900">{item.judul}</h2><p className="mt-2 text-sm text-gray-600">{item.deskripsi}</p></div></article>)}
        </div>
      </section>
      {editing && <AdminContentEditor title="Edit Galeri Foto" items={items} fields={[{ key: 'judul', label: 'Judul foto' }, { key: 'url', label: 'Upload gambar', image: true }, { key: 'deskripsi', label: 'Deskripsi', multiline: true }]} onSave={saveItems} onImageChange={uploadImage} onClose={() => setEditing(false)} />}
    </>
  );
}
