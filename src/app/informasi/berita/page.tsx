"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminContentEditor from '@/components/ui/AdminContentEditor';
import { uploadPublicImage } from '@/lib/supabase';

type NewsItem = {
  title: string;
  date: string;
  desc: string;
  thumbnail: string;
  link: string;
  tag: string;
};

const defaultNews: NewsItem[] = [
  {
    title: 'Penerimaan Santri Baru Gelombang 1',
    date: '15 Mei 2026',
    desc: 'Pendaftaran santri baru untuk tahun ajaran depan telah resmi dibuka.',
    thumbnail: '/berita-1.jpg',
    link: '/penerimaan-santri-baru',
    tag: 'Pengumuman',
  },
  {
    title: 'Prestasi Santri di MTQ Nasional',
    date: '02 Mei 2026',
    desc: 'Prestasi santri PP Roudlotul Abror dalam cabang Musabaqah Hifdzil Qur’an.',
    thumbnail: '/berita-2.jpg',
    link: '/informasi/prestasi',
    tag: 'Prestasi',
  },
  {
    title: 'Kunjungan Studi Banding',
    date: '28 April 2026',
    desc: 'Kunjungan studi banding untuk mempelajari sistem madrasah diniyah.',
    thumbnail: '/berita-3.jpg',
    link: '/informasi/berita',
    tag: 'Kegiatan',
  },
];

export default function BeritaPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<NewsItem[]>(defaultNews);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'content', 'berita'), (snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setItems(snapshot.data().items as NewsItem[]);
      }
    }, () => undefined);
  }, []);

  const saveNews = async (nextItems: Record<string, string>[]) => {
    await setDoc(doc(db, 'content', 'berita'), { items: nextItems });
    setItems(nextItems as NewsItem[]);
  };

  const uploadThumbnail = async (_index: number, _key: string, file: File, onProgress?: (progress: number) => void) => {
    if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran thumbnail maksimal 5 MB.');
    return uploadPublicImage(file, 'berita', onProgress);
  };

  return (
    <>
      <section className="bg-emerald-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Berita</h1>
          <p className="text-lg text-emerald-100">Informasi terbaru PP Modern Roudlotul Abror</p>
          {isAdmin && <button onClick={() => setEditing(true)} className="mt-6 rounded-lg bg-amber-500 px-5 py-2.5 font-bold text-emerald-950">Edit Berita</button>}
        </div>
      </section>

      <section className="min-h-[60vh] bg-[#faf9f6] py-20">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          {items.map((item) => {
            const external = item.link.startsWith('http');
            return (
              <article key={`${item.title}-${item.date}`} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
                <a href={item.link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="block h-56 bg-gray-200">
                  {item.thumbnail ? <img src={item.thumbnail} alt={`Thumbnail ${item.title}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-500">Thumbnail berita</div>}
                </a>
                <div className="p-7">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{item.tag}</span>
                  <p className="mt-4 text-sm text-gray-400">{item.date}</p>
                  <h2 className="mt-2 text-xl font-bold text-emerald-900"><a href={item.link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{item.title}</a></h2>
                  <p className="mt-3 leading-relaxed text-gray-600">{item.desc}</p>
                  <a href={item.link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="mt-5 inline-block font-bold text-amber-600">Baca Selengkapnya →</a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {editing && <AdminContentEditor title="Edit Berita" items={items} fields={[{ key: 'title', label: 'Judul berita' }, { key: 'date', label: 'Tanggal berita' }, { key: 'tag', label: 'Kategori/tag' }, { key: 'link', label: 'Link berita' }, { key: 'desc', label: 'Deskripsi', multiline: true }, { key: 'thumbnail', label: 'Upload thumbnail berita', image: true }, { key: 'thumbnail', label: 'URL thumbnail berita' }]} onSave={saveNews} onImageChange={uploadThumbnail} onClose={() => setEditing(false)} />}
    </>
  );
}
