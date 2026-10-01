"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminContentEditor from '@/components/ui/AdminContentEditor';
import { uploadPublicImage } from '@/lib/supabase';

const defaultItems = [
  { tahun: '2024', judul: 'Juara Umum PORSADIN Tingkat Kecamatan Maos', deskripsi: 'Meraih Juara Umum PORSADIN tingkat Kecamatan Maos dari 41 lembaga.', foto: '' },
  { tahun: '2024', judul: 'Prestasi PORSADIN Tingkat Kabupaten', deskripsi: 'Santri berprestasi dalam berbagai cabang lomba keagamaan dan seni.', foto: '' },
];

export default function PrestasiPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState(defaultItems);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'content', 'prestasi')).then((snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) setItems(snapshot.data().items);
    }).catch(() => undefined);
  }, []);

  const saveItems = async (nextItems: Record<string, string>[]) => {
    await setDoc(doc(db, 'content', 'prestasi'), { items: nextItems });
    setItems(nextItems as typeof defaultItems);
  };

  const uploadImage = async (_index: number, _key: string, file: File, onProgress?: (progress: number) => void) => uploadPublicImage(file, 'prestasi', onProgress);

  return (
    <>
      <section className="bg-emerald-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Prestasi</h1>
          <p className="text-lg text-emerald-100">Pencapaian santri PP Modern Roudlotul Abror</p>
          {isAdmin && <button onClick={() => setEditing(true)} className="mt-6 rounded-lg bg-amber-500 px-5 py-2.5 font-bold text-emerald-950">Edit Prestasi</button>}
        </div>
      </section>
      <section className="min-h-[60vh] bg-gray-50 py-20">
        <div className="container mx-auto max-w-4xl space-y-5 px-4">
          {items.map((item) => <article key={`${item.tahun}-${item.judul}`} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">{item.foto && <img src={item.foto} alt={item.judul} className="h-52 w-full object-cover" />}<div className="p-6"><span className="font-bold text-amber-600">{item.tahun}</span><h2 className="mt-2 text-xl font-bold text-emerald-900">{item.judul}</h2><p className="mt-2 text-gray-600">{item.deskripsi}</p></div></article>)}
        </div>
      </section>
      {editing && <AdminContentEditor title="Edit Prestasi" items={items} fields={[{ key: 'tahun', label: 'Tahun' }, { key: 'judul', label: 'Judul prestasi' }, { key: 'deskripsi', label: 'Deskripsi', multiline: true }, { key: 'foto', label: 'Upload gambar prestasi', image: true }]} onSave={saveItems} onImageChange={uploadImage} onClose={() => setEditing(false)} />}
    </>
  );
}
